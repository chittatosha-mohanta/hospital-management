import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Hospital from '../models/Hospital.js';
import generateToken from '../utils/generateToken.js';

// @desc    Add a doctor to hospital (hospital admin)
// @route   POST /api/doctors
export const addDoctor = async (req, res) => {
  try {
    const {
      name, email, password, phone,
      specialization, qualification, experience,
      consultationFee, bio, languages, registrationNumber,
      schedule,
    } = req.body;

    const hospitalId = req.user.hospital;

    // Check hospital is approved
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || hospital.status !== 'approved') {
      return res.status(400).json({ message: 'Your hospital must be approved before adding doctors' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Create user with doctor role
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'doctor',
      hospital: hospitalId,
    });

    // Create doctor profile
    const doctorProfile = await DoctorProfile.create({
      user: user._id,
      hospital: hospitalId,
      specialization,
      qualification,
      experience,
      consultationFee,
      bio,
      languages: languages || [],
      registrationNumber,
      schedule: schedule || [],
    });

    // Update hospital doctor count
    hospital.totalDoctors = await User.countDocuments({ hospital: hospitalId, role: 'doctor', isActive: true });
    await hospital.save();

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      profile: doctorProfile,
      message: 'Doctor added successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors in my hospital (hospital admin)
// @route   GET /api/doctors/hospital
export const getHospitalDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ hospital: req.user.hospital })
      .populate('user', 'name email phone avatar isActive');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors for a specific hospital (public)
// @route   GET /api/doctors/hospital/:hospitalId
export const getDoctorsByHospital = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const query = { hospital: req.params.hospitalId };

    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    const doctors = await DoctorProfile.find(query)
      .populate('user', 'name email phone avatar')
      .populate('hospital', 'name slug');

    let results = doctors;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      results = doctors.filter(
        (d) =>
          searchRegex.test(d.user?.name) ||
          searchRegex.test(d.specialization) ||
          searchRegex.test(d.qualification)
      );
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor profile by user ID (public)
// @route   GET /api/doctors/:userId
export const getDoctorProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email phone avatar')
      .populate('hospital', 'name slug address logo')
      .populate('schedule.shifts.hospital', 'name slug address')
      .populate('dateOverrides.shifts.hospital', 'name slug address');

    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile (doctor or hospital admin)
// @route   PUT /api/doctors/:userId
export const updateDoctorProfile = async (req, res) => {
  try {
    // Doctor can update own profile, hospital admin can update doctors in their hospital
    let profile;

    if (req.user.role === 'doctor') {
      profile = await DoctorProfile.findOne({ user: req.user._id });
    } else if (req.user.role === 'hospitalAdmin') {
      profile = await DoctorProfile.findOne({
        user: req.params.userId,
        hospital: req.user.hospital,
      });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const allowedFields = [
      'specialization', 'qualification', 'experience',
      'consultationFee', 'bio', 'languages', 'registrationNumber',
      'schedule', 'dateOverrides', 'isAcceptingAppointments',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    res.json({ profile, message: 'Doctor profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove doctor from hospital (hospital admin)
// @route   DELETE /api/doctors/:userId
export const removeDoctor = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId,
      hospital: req.user.hospital,
      role: 'doctor',
    });

    if (!user) {
      return res.status(404).json({ message: 'Doctor not found in your hospital' });
    }

    // Deactivate instead of deleting (preserve appointment history)
    user.isActive = false;
    await user.save();

    // Update hospital doctor count
    const hospital = await Hospital.findById(req.user.hospital);
    hospital.totalDoctors = await User.countDocuments({
      hospital: req.user.hospital,
      role: 'doctor',
      isActive: true,
    });
    await hospital.save();

    res.json({ message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search all doctors across hospitals (public)
// @route   GET /api/doctors
export const searchDoctors = async (req, res) => {
  try {
    const { specialization, city, search, sort, page = 1, limit = 12 } = req.query;

    const pipeline = [
      // Lookup user info
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      // Only active doctors
      { $match: { 'userInfo.isActive': true } },
      // Lookup hospital info
      {
        $lookup: {
          from: 'hospitals',
          localField: 'hospital',
          foreignField: '_id',
          as: 'hospitalInfo',
        },
      },
      { $unwind: '$hospitalInfo' },
      // Only approved hospitals
      { $match: { 'hospitalInfo.status': 'approved' } },
    ];

    // Filters
    if (specialization) {
      pipeline.push({ $match: { specialization: new RegExp(specialization, 'i') } });
    }

    if (city) {
      pipeline.push({ $match: { 'hospitalInfo.address.city': new RegExp(city, 'i') } });
    }

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'userInfo.name': new RegExp(search, 'i') },
            { specialization: new RegExp(search, 'i') },
            { qualification: new RegExp(search, 'i') },
            { 'hospitalInfo.name': new RegExp(search, 'i') },
          ],
        },
      });
    }

    // Project fields
    pipeline.push({
      $project: {
        _id: 1,
        specialization: 1,
        qualification: 1,
        experience: 1,
        consultationFee: 1,
        bio: 1,
        avgRating: 1,
        totalReviews: 1,
        isAcceptingAppointments: 1,
        schedule: 1,
        'user': {
          _id: '$userInfo._id',
          name: '$userInfo.name',
          avatar: '$userInfo.avatar',
        },
        'hospital': {
          _id: '$hospitalInfo._id',
          name: '$hospitalInfo.name',
          slug: '$hospitalInfo.slug',
          city: '$hospitalInfo.address.city',
          logo: '$hospitalInfo.logo',
        },
      },
    });

    // Sort
    if (sort === 'rating') pipeline.push({ $sort: { avgRating: -1 } });
    else if (sort === 'experience') pipeline.push({ $sort: { experience: -1 } });
    else if (sort === 'fee_low') pipeline.push({ $sort: { consultationFee: 1 } });
    else if (sort === 'fee_high') pipeline.push({ $sort: { consultationFee: -1 } });
    else pipeline.push({ $sort: { avgRating: -1, totalReviews: -1 } });

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await DoctorProfile.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Get paginated results
    pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });
    const doctors = await DoctorProfile.aggregate(pipeline);

    res.json({
      doctors,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
