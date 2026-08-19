import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';

// @desc    Create prescription (doctor, after completing appointment)
// @route   POST /api/prescriptions
export const createPrescription = async (req, res) => {
  try {
    const {
      appointmentId, diagnosis, symptoms, medicines,
      tests, advice, followUpDate, vitals,
    } = req.body;

    // Verify appointment belongs to this doctor
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user._id,
    }).populate('patient', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.prescription) {
      return res.status(400).json({ message: 'Prescription already exists for this appointment' });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: req.user._id,
      hospital: appointment.hospital,
      diagnosis,
      symptoms: symptoms || [],
      medicines: medicines || [],
      tests: tests || [],
      advice,
      followUpDate,
      vitals,
    });

    // Link prescription to appointment and mark as completed
    appointment.prescription = prescription._id;
    appointment.status = 'completed';
    await appointment.save();

    // Update doctor profile stats
    const DoctorProfile = (await import('../models/DoctorProfile.js')).default;
    await DoctorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { totalPatients: 1 } }
    );

    // Notify patient
    await Notification.create({
      recipient: appointment.patient._id,
      type: 'prescription_added',
      title: 'New Prescription',
      message: `Dr. ${req.user.name} has added a prescription for your visit. Diagnosis: ${diagnosis}`,
      referenceId: prescription._id,
      referenceModel: 'Prescription',
    });

    res.status(201).json({
      prescription,
      message: 'Prescription created and appointment completed',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescriptions for a patient (patient views own, doctor views their patients)
// @route   GET /api/prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    } else if (req.user.role === 'hospitalAdmin') {
      query.hospital = req.user.hospital;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [prescriptions, total] = await Promise.all([
      Prescription.find(query)
        .populate('patient', 'name email')
        .populate('doctor', 'name email')
        .populate('hospital', 'name')
        .populate('appointment', 'date timeSlot')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Prescription.countDocuments(query),
    ]);

    res.json({
      prescriptions,
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

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
export const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone gender dateOfBirth bloodGroup')
      .populate('doctor', 'name email')
      .populate('hospital', 'name address phone')
      .populate('appointment', 'date timeSlot');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Only allow access to relevant users
    const isPatient = prescription.patient._id.toString() === req.user._id.toString();
    const isDoctor = prescription.doctor._id.toString() === req.user._id.toString();
    const isHospitalAdmin = req.user.role === 'hospitalAdmin' &&
      prescription.hospital._id.toString() === req.user.hospital?.toString();
    const isSuperAdmin = req.user.role === 'superAdmin';

    if (!isPatient && !isDoctor && !isHospitalAdmin && !isSuperAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this prescription' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
