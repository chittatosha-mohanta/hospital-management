import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
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
    hospitalName: {
      type: String,
      default: '',
    },
    roomOrClinic: {
      type: String,
      default: '',
    },

    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    reason: {
      type: String,
      default: '',
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },

    // After completion
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null,
    },

    // Cancellation
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    cancellationReason: {
      type: String,
      default: '',
    },

    // Notes
    doctorNotes: {
      type: String,
      default: '',
    },

    // Fee
    consultationFee: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ hospital: 1, date: -1, status: 1 });
appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true }); // Prevent double-booking

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
