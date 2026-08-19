import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';

// @desc    Get all approved hospitals (public)
// @route   GET /api/hospitals
export const getHospitals = async (req, res) => {
  try {
    const { city, specialty, search, sort, page = 1, limit = 12 } = req.query;

    const query = { status: 'approved' };

    // Filter by city
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    // Filter by specialty
    if (specialty) {
      query.specialties = { $in: [new RegExp(specialty, 'i')] };
    }

    // Text search
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { specialties: { $in: [new RegExp(search, 'i')] } },
        { 'address.city': new RegExp(search, 'i') },
      ];
    }

    // Sort options
    let sortOption = { isFeatured: -1, avgRating: -1 };
    if (sort === 'rating') sortOption = { avgRating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'doctors') sortOption = { totalDoctors: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [hospitals, total] = await Promise.all([
      Hospital.find(query)
        .select('-verificationDocuments -rejectionReason -registeredBy')
        .sort(sortOption)
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
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hospital by slug (public)
// @route   GET /api/hospitals/:slug
export const getHospitalBySlug = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      slug: req.params.slug,
      status: 'approved',
    }).select('-verificationDocuments -rejectionReason');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Get doctors for this hospital
    const doctors = await DoctorProfile.find({ hospital: hospital._id })
      .populate('user', 'name email avatar phone')
      .select('specialization qualification experience consultationFee avgRating totalReviews isAcceptingAppointments');

    res.json({ hospital, doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my hospital (for hospital admin)
// @route   GET /api/hospitals/my-hospital
export const getMyHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.hospital);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update my hospital (for hospital admin)
// @route   PUT /api/hospitals/my-hospital
export const updateMyHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.hospital);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const allowedFields = [
      'name', 'description', 'logo', 'coverImage', 'images',
      'email', 'phone', 'website',
      'address', 'coordinates',
      'specialties', 'facilities',
      'emergencyServices', 'ambulanceService', 'bedCount',
      'operatingHours',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hospital[field] = req.body[field];
      }
    });

    await hospital.save();

    res.json({ hospital, message: 'Hospital updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hospital stats (for hospital admin dashboard)
// @route   GET /api/hospitals/my-hospital/stats
export const getHospitalStats = async (req, res) => {
  try {
    const hospitalId = req.user.hospital;

    const [hospital, doctorCount, recentAppointments] = await Promise.all([
      Hospital.findById(hospitalId),
      User.countDocuments({ hospital: hospitalId, role: 'doctor', isActive: true }),
      // Import Appointment at runtime to avoid circular dependency
      import('../models/Appointment.js').then(({ default: Appointment }) =>
        Appointment.aggregate([
          { $match: { hospital: hospitalId } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ])
      ),
    ]);

    const statusCounts = {};
    recentAppointments.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      hospitalName: hospital.name,
      status: hospital.status,
      totalDoctors: doctorCount,
      totalAppointments: hospital.totalAppointments,
      avgRating: hospital.avgRating,
      totalReviews: hospital.totalReviews,
      appointmentsByStatus: {
        pending: statusCounts.pending || 0,
        confirmed: statusCounts.confirmed || 0,
        completed: statusCounts.completed || 0,
        cancelled: statusCounts.cancelled || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured hospitals (public, for homepage)
// @route   GET /api/hospitals/featured
export const getFeaturedHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      status: 'approved',
      isFeatured: true,
    })
      .select('name slug logo coverImage address specialties avgRating totalReviews totalDoctors')
      .sort({ avgRating: -1 })
      .limit(6);

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unique cities (for filter dropdown)
// @route   GET /api/hospitals/cities
export const getCities = async (req, res) => {
  try {
    const cities = await Hospital.distinct('address.city', { status: 'approved' });
    res.json(cities.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
