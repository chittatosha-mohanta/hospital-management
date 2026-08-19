import mongoose from 'mongoose';

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },

    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    registrationNumber: {
      type: String,
      default: '',
    },

    // Availability Schedule (Multi-Hospital & Shift Enabled)
    schedule: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        // Multi-hospital shifts for this day (e.g. Hospital A 9-11 AM, Hospital B 1-3 PM)
        shifts: [
          {
            hospital: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Hospital',
            },
            hospitalName: {
              type: String,
              default: '',
            },
            roomOrClinic: {
              type: String,
              default: '',
            },
            startTime: {
              type: String,
              default: '09:00',
            },
            endTime: {
              type: String,
              default: '12:00',
            },
            slotDuration: {
              type: Number,
              default: 30,
              enum: [15, 20, 30, 45, 60],
            },
            consultationFee: {
              type: Number,
            },
          },
        ],
        // Legacy fallback fields for single-shift days
        startTime: {
          type: String,
          default: '09:00',
        },
        endTime: {
          type: String,
          default: '17:00',
        },
        slotDuration: {
          type: Number,
          default: 30,
          enum: [15, 20, 30, 45, 60],
        },
        maxPatients: {
          type: Number,
          default: 20,
        },
      },
    ],

    // Specific Date Adjustments & Leaves (Calendar Date Overrides)
    dateOverrides: [
      {
        date: {
          type: String, // Format: YYYY-MM-DD
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        shifts: [
          {
            hospital: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Hospital',
            },
            hospitalName: {
              type: String,
              default: '',
            },
            roomOrClinic: {
              type: String,
              default: '',
            },
            startTime: {
              type: String,
              default: '09:00',
            },
            endTime: {
              type: String,
              default: '12:00',
            },
            slotDuration: {
              type: Number,
              default: 30,
              enum: [15, 20, 30, 45, 60],
            },
          },
        ],
        startTime: {
          type: String,
          default: "09:00",
        },
        endTime: {
          type: String,
          default: "17:00",
        },
        slotDuration: {
          type: Number,
          default: 30,
          enum: [15, 20, 30, 45, 60],
        },
        reason: {
          type: String,
          default: '',
        },
      },
    ],

    // Stats
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingAppointments: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
doctorProfileSchema.index({ specialization: 'text', bio: 'text' });
doctorProfileSchema.index({ hospital: 1, specialization: 1 });
doctorProfileSchema.index({ avgRating: -1, totalReviews: -1 });

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);
export default DoctorProfile;
