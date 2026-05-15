const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicines: [
    {
      name: String,
      dosage: String,
      duration: String,
      instructions: String,
    },
  ],
  diagnosis: {
    type: String,
    required: true,
  },
  advice: String,
  reports: [
    {
      name: String,
      url: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
