import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import sendEmail, { emailTemplates } from '../utils/sendEmail.js';

// @desc    Get all hospitals (for super admin — includes pending)
// @route   GET /api/super-admin/hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { 'address.city': new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [hospitals, total] = await Promise.all([
      Hospital.find(query)
        .populate('registeredBy', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Hospital.countDocuments(query),
    ]);

    res.json({
      hospitals,
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

// @desc    Approve/Reject hospital
// @route   PUT /api/super-admin/hospitals/:id/status
export const updateHospitalStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const hospital = await Hospital.findById(req.params.id)
      .populate('registeredBy', 'name email');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.status = status;
    if (rejectionReason) hospital.rejectionReason = rejectionReason;
    await hospital.save();

    // Notify hospital admin
    await Notification.create({
      recipient: hospital.registeredBy._id,
      type: status === 'approved' ? 'hospital_approved' : 'hospital_rejected',
      title: status === 'approved' ? 'Hospital Approved! 🎉' : 'Hospital Not Approved',
      message: status === 'approved'
        ? `Your hospital "${hospital.name}" has been approved! You can now add doctors and receive bookings.`
        : `Your hospital "${hospital.name}" was not approved. Reason: ${rejectionReason}`,
      referenceId: hospital._id,
      referenceModel: 'Hospital',
    });

    // Send email
    if (status === 'approved') {
      const template = emailTemplates.hospitalApproved(hospital.name);
      sendEmail({ to: hospital.registeredBy.email, ...template }).catch(console.error);
    } else if (status === 'rejected') {
      const template = emailTemplates.hospitalRejected(hospital.name, rejectionReason);
      sendEmail({ to: hospital.registeredBy.email, ...template }).catch(console.error);
    }

    res.json({ hospital, message: `Hospital ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle featured hospital
// @route   PUT /api/super-admin/hospitals/:id/feature
export const toggleFeatured = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.isFeatured = !hospital.isFeatured;
    await hospital.save();

    res.json({
      hospital,
      message: hospital.isFeatured ? 'Hospital featured' : 'Hospital unfeatured',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/super-admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('hospital', 'name slug')
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      users,
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

// @desc    Toggle user active status
// @route   PUT /api/super-admin/users/:id/toggle-status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'superAdmin') {
      return res.status(400).json({ message: 'Cannot deactivate a super admin' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      user: { _id: user._id, name: user.name, isActive: user.isActive },
      message: user.isActive ? 'User activated' : 'User deactivated',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform analytics
// @route   GET /api/super-admin/analytics
export const getPlatformAnalytics = async (req, res) => {
  try {
    const [
      totalHospitals,
      approvedHospitals,
      pendingHospitals,
      totalDoctors,
      totalPatients,
      totalAppointments,
      appointmentsByStatus,
      recentHospitals,
      topHospitals,
    ] = await Promise.all([
      Hospital.countDocuments(),
      Hospital.countDocuments({ status: 'approved' }),
      Hospital.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments(),
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Hospital.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name status createdAt address'),
      Hospital.find({ status: 'approved' })
        .sort({ avgRating: -1 })
        .limit(5)
        .select('name avgRating totalReviews totalDoctors address'),
    ]);

    const statusMap = {};
    appointmentsByStatus.forEach((s) => (statusMap[s._id] = s.count));

    res.json({
      overview: {
        totalHospitals,
        approvedHospitals,
        pendingHospitals,
        totalDoctors,
        totalPatients,
        totalAppointments,
      },
      appointmentsByStatus: {
        pending: statusMap.pending || 0,
        confirmed: statusMap.confirmed || 0,
        completed: statusMap.completed || 0,
        cancelled: statusMap.cancelled || 0,
      },
      recentHospitals,
      topHospitals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
