import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Hospital from '../models/Hospital.js';
import Notification from '../models/Notification.js';
import sendEmail, { emailTemplates } from '../utils/sendEmail.js';

// @desc    Book an appointment (patient)
// @route   POST /api/appointments
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, hospitalId, hospitalName, roomOrClinic, date, timeSlot, reason } = req.body;

    // Verify doctor exists
    const doctorProfile = await DoctorProfile.findOne({
      user: doctorId,
    }).populate('user', 'name email').populate('hospital', 'name');

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!doctorProfile.isAcceptingAppointments) {
      return res.status(400).json({ message: 'This doctor is not currently accepting appointments' });
    }

    // Check hospital
    const targetHospitalId = hospitalId || doctorProfile.hospital?._id;
    const hospital = await Hospital.findById(targetHospitalId);
    if (!hospital || hospital.status !== 'approved') {
      return res.status(400).json({ message: 'This hospital is not available for booking' });
    }

    // Check for duplicate booking
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const resolvedHospitalName = hospitalName || hospital.name;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      hospital: targetHospitalId,
      hospitalName: resolvedHospitalName,
      roomOrClinic: roomOrClinic || '',
      date: new Date(date),
      timeSlot,
      reason,
      consultationFee: doctorProfile.consultationFee,
    });

    // Update hospital stats
    hospital.totalAppointments += 1;
    await hospital.save();

    // Update doctor stats
    doctorProfile.totalAppointments += 1;
    await doctorProfile.save();

    // Create notifications
    await Notification.create([
      {
        recipient: doctorId,
        type: 'appointment_booked',
        title: 'New Appointment',
        message: `${req.user.name} booked an appointment for ${new Date(date).toLocaleDateString()} at ${timeSlot}`,
        referenceId: appointment._id,
        referenceModel: 'Appointment',
      },
      {
        recipient: req.user._id,
        type: 'appointment_booked',
        title: 'Appointment Confirmed',
        message: `Your appointment with Dr. ${doctorProfile.user.name} at ${hospital.name} is booked for ${new Date(date).toLocaleDateString()} at ${timeSlot}`,
        referenceId: appointment._id,
        referenceModel: 'Appointment',
      },
    ]);

    // Send email
    const template = emailTemplates.appointmentBooked(
      req.user.name,
      doctorProfile.user.name,
      hospital.name,
      new Date(date).toLocaleDateString(),
      timeSlot
    );
    sendEmail({ to: req.user.email, ...template }).catch(console.error);

    res.status(201).json({
      appointment,
      message: 'Appointment booked successfully!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my
export const getMyAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { patient: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('doctor', 'name email avatar phone')
        .populate('hospital', 'name slug logo address')
        .populate('prescription')
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query),
    ]);

    res.json({
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;

    const query = { doctor: req.user._id };
    if (status) query.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('patient', 'name email avatar phone gender dateOfBirth bloodGroup')
        .populate('hospital', 'name')
        .populate('prescription')
        .sort({ date: -1, timeSlot: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query),
    ]);

    res.json({
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hospital appointments (hospital admin)
// @route   GET /api/appointments/hospital
export const getHospitalAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;

    const query = { hospital: req.user.hospital };
    if (status) query.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('patient', 'name email phone')
        .populate('doctor', 'name email')
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query),
    ]);

    res.json({
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (doctor)
// @route   PUT /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellationReason, doctorNotes } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify the doctor or hospital admin owns this appointment
    if (
      req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    if (
      req.user.role === 'hospitalAdmin' &&
      appointment.hospital.toString() !== req.user.hospital.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason;
      appointment.cancelledBy = req.user._id;
    }
    if (doctorNotes) {
      appointment.doctorNotes = doctorNotes;
    }

    await appointment.save();

    // Notify patient
    await Notification.create({
      recipient: appointment.patient._id,
      type: `appointment_${status}`,
      title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your appointment with Dr. ${appointment.doctor.name} has been ${status}.`,
      referenceId: appointment._id,
      referenceModel: 'Appointment',
    });

    res.json({ appointment, message: `Appointment ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment (patient)
// @route   PUT /api/appointments/:id/cancel
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${appointment.status} appointment` });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user._id;
    appointment.cancellationReason = req.body.reason || 'Cancelled by patient';
    await appointment.save();

    // Notify doctor
    await Notification.create({
      recipient: appointment.doctor,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `${req.user.name} cancelled their appointment on ${appointment.date.toLocaleDateString()} at ${appointment.timeSlot}`,
      referenceId: appointment._id,
      referenceModel: 'Appointment',
    });

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available time slots for a doctor on a date
// @route   GET /api/appointments/slots/:doctorId/:date
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId }).populate('hospital', 'name address');
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const defaultHospitalName = doctorProfile.hospital?.name || 'Main Hospital';
    const defaultHospitalId = doctorProfile.hospital?._id;

    // Check if there is a specific calendar date override for this date
    const dateFormatted = date.split('T')[0];
    const dateOverride = (doctorProfile.dateOverrides || []).find(
      (o) => o.date === dateFormatted
    );

    let activeSchedule = null;

    if (dateOverride) {
      if (!dateOverride.isAvailable) {
        return res.json({ 
          slots: [], 
          message: dateOverride.reason ? `Doctor is not available: ${dateOverride.reason}` : 'Doctor is on leave on this date',
          isOverridden: true 
        });
      }
      activeSchedule = dateOverride;
    } else {
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const daySchedule = doctorProfile.schedule.find(
        (s) => s.day === dayOfWeek && s.isAvailable
      );

      if (!daySchedule) {
        return res.json({ slots: [], message: 'Doctor is not available on this day' });
      }
      activeSchedule = daySchedule;
    }

    // Determine shifts to generate slots from
    let shiftsToProcess = [];
    if (activeSchedule.shifts && activeSchedule.shifts.length > 0) {
      shiftsToProcess = activeSchedule.shifts;
    } else if (activeSchedule.startTime && activeSchedule.endTime) {
      shiftsToProcess = [
        {
          hospital: defaultHospitalId,
          hospitalName: defaultHospitalName,
          roomOrClinic: '',
          startTime: activeSchedule.startTime,
          endTime: activeSchedule.endTime,
          slotDuration: activeSchedule.slotDuration || 30,
        },
      ];
    }

    // Generate all possible slots across all shifts
    const allSlots = [];

    shiftsToProcess.forEach((shift) => {
      if (!shift.startTime || !shift.endTime) return;
      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);
      const duration = shift.slotDuration || 30;

      let currentMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      while (currentMinutes + duration <= endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const mins = currentMinutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        const timeLabel = `${String(displayHours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;

        allSlots.push({
          time: timeLabel,
          hospitalId: shift.hospital || defaultHospitalId,
          hospitalName: shift.hospitalName || defaultHospitalName,
          roomOrClinic: shift.roomOrClinic || '',
          shiftStartTime: shift.startTime,
          shiftEndTime: shift.endTime,
        });

        currentMinutes += duration;
      }
    });

    // Get booked slots for this date
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lt: endOfDay },
      status: { $nin: ['cancelled'] },
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map((a) => a.timeSlot);

    const availableSlots = allSlots.map((slotObj) => ({
      time: slotObj.time,
      hospitalId: slotObj.hospitalId,
      hospitalName: slotObj.hospitalName,
      roomOrClinic: slotObj.roomOrClinic,
      available: !bookedSlots.includes(slotObj.time),
    }));

    res.json({ 
      slots: availableSlots, 
      shifts: shiftsToProcess,
      daySchedule: activeSchedule 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
