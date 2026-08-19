import Review from '../models/Review.js';
import Hospital from '../models/Hospital.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';

// @desc    Create a review (patient, after completed appointment)
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { appointmentId, rating, title, comment, doctorId } = req.body;

    // Verify the appointment was completed by this patient
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.user._id,
      status: 'completed',
    });

    if (!appointment) {
      return res.status(400).json({
        message: 'You can only review after a completed appointment',
      });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ appointment: appointmentId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this appointment' });
    }

    const review = await Review.create({
      patient: req.user._id,
      hospital: appointment.hospital,
      doctor: doctorId || appointment.doctor,
      appointment: appointmentId,
      rating,
      title,
      comment,
    });

    // Update hospital average rating
    const hospitalReviews = await Review.aggregate([
      { $match: { hospital: appointment.hospital } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (hospitalReviews.length > 0) {
      await Hospital.findByIdAndUpdate(appointment.hospital, {
        avgRating: Math.round(hospitalReviews[0].avgRating * 10) / 10,
        totalReviews: hospitalReviews[0].count,
      });
    }

    // Update doctor average rating
    if (doctorId || appointment.doctor) {
      const targetDoctor = doctorId || appointment.doctor;
      const doctorReviews = await Review.aggregate([
        { $match: { doctor: targetDoctor } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);

      if (doctorReviews.length > 0) {
        await DoctorProfile.findOneAndUpdate(
          { user: targetDoctor },
          {
            avgRating: Math.round(doctorReviews[0].avgRating * 10) / 10,
            totalReviews: doctorReviews[0].count,
          }
        );
      }
    }

    // Notify hospital admin
    const hospital = await Hospital.findById(appointment.hospital);
    if (hospital) {
      await Notification.create({
        recipient: hospital.registeredBy,
        type: 'review_received',
        title: 'New Review',
        message: `${req.user.name} left a ${rating}-star review for your hospital`,
        referenceId: review._id,
        referenceModel: 'Review',
      });
    }

    res.status(201).json({ review, message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a hospital (public)
// @route   GET /api/reviews/hospital/:hospitalId
export const getHospitalReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortOption = { createdAt: -1 };
    if (sort === 'rating_high') sortOption = { rating: -1 };
    if (sort === 'rating_low') sortOption = { rating: 1 };

    const [reviews, total] = await Promise.all([
      Review.find({ hospital: req.params.hospitalId })
        .populate('patient', 'name avatar')
        .populate('doctor', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ hospital: req.params.hospitalId }),
    ]);

    res.json({
      reviews,
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

// @desc    Get reviews for a doctor (public)
// @route   GET /api/reviews/doctor/:doctorId
export const getDoctorReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ doctor: req.params.doctorId })
        .populate('patient', 'name avatar')
        .populate('hospital', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ doctor: req.params.doctorId }),
    ]);

    res.json({
      reviews,
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

// @desc    Respond to a review (hospital admin)
// @route   PUT /api/reviews/:id/respond
export const respondToReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      hospital: req.user.hospital,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.response = {
      text: req.body.response,
      respondedAt: new Date(),
    };
    await review.save();

    res.json({ review, message: 'Response added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
