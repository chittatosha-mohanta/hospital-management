import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },

    // Hospital admin response
    response: {
      text: { type: String, default: '' },
      respondedAt: { type: Date, default: null },
    },

    isVerified: {
      type: Boolean,
      default: true, // Auto-verified since linked to appointment
    },
  },
  {
    timestamps: true,
  }
);

// One review per appointment
reviewSchema.index({ appointment: 1 }, { unique: true });
reviewSchema.index({ hospital: 1, rating: -1 });
reviewSchema.index({ doctor: 1, rating: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
