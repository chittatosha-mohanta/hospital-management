import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
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
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },

    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
    },
    symptoms: [String],

    medicines: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        instructions: {
          type: String,
          default: '',
        },
        frequency: {
          type: String,
          default: '',
        },
      },
    ],

    tests: [
      {
        name: String,
        description: String,
      },
    ],

    advice: {
      type: String,
      default: '',
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    // Vitals recorded during visit
    vitals: {
      bloodPressure: { type: String, default: '' },
      temperature: { type: String, default: '' },
      pulse: { type: String, default: '' },
      weight: { type: String, default: '' },
      height: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ hospital: 1, createdAt: -1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
