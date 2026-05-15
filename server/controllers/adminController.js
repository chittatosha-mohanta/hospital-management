const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Department = require('../models/Department');

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
const getDoctors = async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }).select('-password');
  res.json(doctors);
};

// @desc    Create a doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
  const { name, email, password, specialization, experience, department } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'doctor',
  });

  if (user) {
    await Doctor.create({
      user: user._id,
      specialization,
      experience,
      department,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid doctor data' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalPatients = await User.countDocuments({ role: 'patient' });
  const totalAppointments = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
  const completedAppointments = await Appointment.countDocuments({ status: 'completed' });

  res.json({
    totalDoctors,
    totalPatients,
    totalAppointments,
    pendingAppointments,
    completedAppointments,
  });
};

module.exports = { getDoctors, createDoctor, getStats };
