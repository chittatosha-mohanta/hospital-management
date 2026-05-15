const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization'],
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
  },
  bio: {
    type: String,
    trim: true,
  },
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      startTime: String,
      endTime: String,
    },
  ],
  fees: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
