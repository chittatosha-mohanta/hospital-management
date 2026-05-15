const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

// @desc    Get all doctors for booking
// @route   GET /api/patient/doctors
// @access  Private/Patient
const getAvailableDoctors = async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }).select('-password');
  res.json(doctors);
};

// @desc    Book an appointment
// @route   POST /api/patient/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, reason } = req.body;

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    date,
    timeSlot,
    reason,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400).json({ message: 'Invalid appointment data' });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/patient/appointments
// @access  Private/Patient
const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate('doctor', 'name email')
    .sort('-date');
  res.json(appointments);
};

module.exports = { getAvailableDoctors, bookAppointment, getMyAppointments };
