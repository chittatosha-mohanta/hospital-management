const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .populate('patient', 'name email')
    .sort('-date');
  res.json(appointments);
};

// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id
// @access  Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
};

// @desc    Add prescription
// @route   POST /api/doctor/prescriptions
// @access  Private/Doctor
const addPrescription = async (req, res) => {
  const { appointmentId, patientId, medicines, diagnosis, advice } = req.body;

  const prescription = await Prescription.create({
    appointment: appointmentId,
    patient: patientId,
    doctor: req.user._id,
    medicines,
    diagnosis,
    advice,
  });

  if (prescription) {
    // Mark appointment as completed
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });
    res.status(201).json(prescription);
  } else {
    res.status(400).json({ message: 'Invalid prescription data' });
  }
};

module.exports = { getDoctorAppointments, updateAppointmentStatus, addPrescription };
