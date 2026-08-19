import mongoose from 'mongoose';
import slugify from 'slugify';

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: [200, 'Hospital name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: [String],

    // Contact
    email: {
      type: String,
      required: [true, 'Hospital email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Hospital phone is required'],
    },
    website: {
      type: String,
      default: '',
    },

    // Location
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    // Features
    specialties: [
      {
        type: String,
        trim: true,
      },
    ],
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    emergencyServices: {
      type: Boolean,
      default: false,
    },
    ambulanceService: {
      type: Boolean,
      default: false,
    },
    bedCount: {
      type: Number,
      default: 0,
    },

    // Operating Hours
    operatingHours: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '20:00' },
      is24x7: { type: Boolean, default: false },
    },

    // Verification
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    verificationDocuments: [String],
    rejectionReason: {
      type: String,
      default: '',
    },

    // Stats (denormalized for performance)
    totalDoctors: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // Ownership
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Featured hospital (promoted by super admin)
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
hospitalSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Index for search and location queries
hospitalSchema.index({ name: 'text', description: 'text', specialties: 'text' });
hospitalSchema.index({ 'address.city': 1, status: 1 });
hospitalSchema.index({ status: 1, isFeatured: -1, avgRating: -1 });

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
