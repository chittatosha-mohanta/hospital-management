const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  medicalHistory: [
    {
      condition: String,
      diagnosisDate: Date,
      treatment: String,
    },
  ],
});

module.exports = mongoose.model('Patient', patientSchema);
