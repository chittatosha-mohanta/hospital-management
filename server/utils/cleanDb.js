import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Department from '../models/Department.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

dotenv.config();

const cleanDatabase = async () => {
  try {
    await connectDB();
    console.log('🧹 Cleaning all dummy data from database...\n');

    // Wipe all dummy entities
    await Hospital.deleteMany({});
    await DoctorProfile.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await User.deleteMany({});

    // Create ONLY the Platform Super Admin account
    await User.create({
      name: 'Platform Admin',
      email: 'admin@healthcarepro.com',
      password: 'admin123',
      role: 'superAdmin',
      phone: '+91 9000000000',
    });

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ ALL DUMMY DATA DELETED SUCCESSFULLY!');
    console.log('   - Hospitals: 0');
    console.log('   - Doctors: 0');
    console.log('   - Patients: 0');
    console.log('   - Appointments & Prescriptions: 0');
    console.log('═══════════════════════════════════════════════════');
    console.log('👑 Platform Super Admin Account (Preserved):');
    console.log('   Email:    admin@healthcarepro.com');
    console.log('   Password: admin123');
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Clean database failed:', error);
    process.exit(1);
  }
};

cleanDatabase();
