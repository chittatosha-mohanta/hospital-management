import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import DoctorProfile from '../models/DoctorProfile.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new patient
// @route   POST /api/auth/register
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dateOfBirth, bloodGroup } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      role: 'patient',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a hospital (creates hospital + hospitalAdmin user)
// @route   POST /api/auth/register-hospital
export const registerHospital = async (req, res) => {
  try {
    const {
      // Admin details
      adminName,
      adminEmail,
      adminPassword,
      adminPhone,
      // Hospital details
      hospitalName,
      hospitalEmail,
      hospitalPhone,
      description,
      website,
      address,
      specialties,
      facilities,
      emergencyServices,
      ambulanceService,
      bedCount,
      operatingHours,
    } = req.body;

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create the hospital admin user first
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      phone: adminPhone,
      role: 'hospitalAdmin',
    });

    // Create the hospital
    const hospital = await Hospital.create({
      name: hospitalName,
      email: hospitalEmail,
      phone: hospitalPhone,
      description,
      website,
      address,
      specialties: specialties || [],
      facilities: facilities || [],
      emergencyServices,
      ambulanceService,
      bedCount,
      operatingHours,
      registeredBy: adminUser._id,
      status: 'pending', // Requires super admin approval
    });

    // Link hospital to admin user
    adminUser.hospital = hospital._id;
    await adminUser.save();

    res.status(201).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      hospital: {
        _id: hospital._id,
        name: hospital.name,
        status: hospital.status,
      },
      token: generateToken(adminUser._id),
      message: 'Hospital registered successfully! Awaiting admin approval.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('hospital', 'name slug status');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact support.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Build response based on role
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      token: generateToken(user._id),
    };

    // Include hospital info for hospital admins and doctors
    if (user.hospital) {
      response.hospital = {
        _id: user.hospital._id,
        name: user.hospital.name,
        slug: user.hospital.slug,
        status: user.hospital.status,
      };
    }

    // Include doctor profile for doctors
    if (user.role === 'doctor') {
      const doctorProfile = await DoctorProfile.findOne({ user: user._id });
      if (doctorProfile) {
        response.doctorProfile = {
          specialization: doctorProfile.specialization,
          qualification: doctorProfile.qualification,
        };
      }
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('hospital', 'name slug status logo');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response = { ...user.toObject() };

    // Include doctor profile
    if (user.role === 'doctor') {
      const doctorProfile = await DoctorProfile.findOne({ user: user._id });
      response.doctorProfile = doctorProfile;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fields that can be updated
    const allowedFields = ['name', 'phone', 'avatar', 'dateOfBirth', 'gender', 'bloodGroup', 'address', 'emergencyContact'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Password change
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }
      const userWithPassword = await User.findById(req.user._id).select('+password');
      const isMatch = await userWithPassword.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
