import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Department from '../models/Department.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...\n');

    // Clear existing data
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await DoctorProfile.deleteMany({});
    await Department.deleteMany({});

    // 1. Create Super Admin
    const superAdmin = await User.create({
      name: 'Platform Admin',
      email: 'admin@healthcarepro.com',
      password: 'admin123',
      role: 'superAdmin',
      phone: '+91 9000000000',
    });
    console.log('✅ Super Admin created: admin@healthcarepro.com / admin123');

    // 2. Create Hospital Admin + Hospital (Apollo)
    const hospitalAdmin1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@apollo.com',
      password: 'hospital123',
      role: 'hospitalAdmin',
      phone: '+91 9100000001',
    });

    const hospital1 = await Hospital.create({
      name: 'Apollo Multi-Specialty Hospital',
      email: 'info@apollo.com',
      phone: '+91 44 2829 3333',
      description: 'Apollo Hospitals is one of the largest healthcare groups in Asia with a robust presence across the healthcare ecosystem.',
      address: {
        street: '21 Greams Lane, Off Greams Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600006',
        country: 'India',
      },
      coordinates: { lat: 13.0604, lng: 80.2496 },
      specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Dermatology'],
      facilities: ['ICU', 'NICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'Blood Bank', 'Cafeteria'],
      emergencyServices: true,
      ambulanceService: true,
      bedCount: 500,
      operatingHours: { open: '00:00', close: '23:59', is24x7: true },
      status: 'approved',
      isFeatured: true,
      registeredBy: hospitalAdmin1._id,
    });

    hospitalAdmin1.hospital = hospital1._id;
    await hospitalAdmin1.save();
    console.log('✅ Hospital 1 created: Apollo Multi-Specialty Hospital (Chennai)');
    console.log('   Admin: rajesh@apollo.com / hospital123');

    // 3. Create Hospital Admin + Hospital (Fortis)
    const hospitalAdmin2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@fortis.com',
      password: 'hospital123',
      role: 'hospitalAdmin',
      phone: '+91 9100000002',
    });

    const hospital2 = await Hospital.create({
      name: 'Fortis Memorial Research Institute',
      email: 'info@fortis.com',
      phone: '+91 124 4962 200',
      description: 'Fortis Memorial Research Institute is a multi-super specialty, quaternary care hospital with leading clinical experts.',
      address: {
        street: 'Sector 44, Opposite HUDA City Centre',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        country: 'India',
      },
      coordinates: { lat: 28.4595, lng: 77.0266 },
      specialties: ['Cardiology', 'Neurosurgery', 'Liver Transplant', 'Oncology', 'Urology', 'ENT'],
      facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology', 'Physiotherapy'],
      emergencyServices: true,
      ambulanceService: true,
      bedCount: 310,
      operatingHours: { open: '00:00', close: '23:59', is24x7: true },
      status: 'approved',
      isFeatured: true,
      registeredBy: hospitalAdmin2._id,
    });

    hospitalAdmin2.hospital = hospital2._id;
    await hospitalAdmin2.save();
    console.log('✅ Hospital 2 created: Fortis Memorial Research Institute (Gurugram)');
    console.log('   Admin: priya@fortis.com / hospital123');

    // 4. Create Hospital (Pending — for testing approval flow)
    const hospitalAdmin3 = await User.create({
      name: 'Amit Patel',
      email: 'amit@medanta.com',
      password: 'hospital123',
      role: 'hospitalAdmin',
      phone: '+91 9100000003',
    });

    const hospital3 = await Hospital.create({
      name: 'Medanta - The Medicity',
      email: 'info@medanta.org',
      phone: '+91 124 4141 414',
      description: 'Medanta is a leading healthcare provider with world-class infrastructure and technology.',
      address: {
        street: 'CH Baktawar Singh Road, Sector 38',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        country: 'India',
      },
      specialties: ['Cardiology', 'Gastroenterology', 'Pulmonology'],
      facilities: ['ICU', 'Emergency', 'Lab'],
      emergencyServices: true,
      status: 'pending',
      registeredBy: hospitalAdmin3._id,
    });

    hospitalAdmin3.hospital = hospital3._id;
    await hospitalAdmin3.save();
    console.log('✅ Hospital 3 created: Medanta (Pending Approval)');

    // 5. Create Doctors for Apollo
    const doctors1Data = [
      { name: 'Dr. Ananya Verma', email: 'ananya@apollo.com', specialization: 'Cardiology', qualification: 'MBBS, MD Cardiology, DM', experience: 15, fee: 1500 },
      { name: 'Dr. Vikram Singh', email: 'vikram@apollo.com', specialization: 'Neurology', qualification: 'MBBS, MD Neurology', experience: 12, fee: 1200 },
      { name: 'Dr. Meera Nair', email: 'meera@apollo.com', specialization: 'Orthopedics', qualification: 'MBBS, MS Ortho', experience: 10, fee: 1000 },
      { name: 'Dr. Arjun Reddy', email: 'arjun@apollo.com', specialization: 'Pediatrics', qualification: 'MBBS, MD Pediatrics', experience: 8, fee: 800 },
    ];

    const defaultSchedule = [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '14:00', slotDuration: 30, maxPatients: 10, isAvailable: true },
      { day: 'Saturday', startTime: '10:00', endTime: '13:00', slotDuration: 30, maxPatients: 6, isAvailable: true },
      { day: 'Sunday', startTime: '10:00', endTime: '13:00', slotDuration: 30, maxPatients: 6, isAvailable: false },
    ];

    for (const doc of doctors1Data) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: 'doctor123',
        role: 'doctor',
        hospital: hospital1._id,
        phone: '+91 91000' + Math.floor(10000 + Math.random() * 90000),
      });

      await DoctorProfile.create({
        user: user._id,
        hospital: hospital1._id,
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        consultationFee: doc.fee,
        bio: `Experienced ${doc.specialization} specialist with ${doc.experience} years of practice.`,
        languages: ['English', 'Hindi', 'Tamil'],
        schedule: defaultSchedule,
        isVerified: true,
        isAcceptingAppointments: true,
      });
    }

    hospital1.totalDoctors = doctors1Data.length;
    await hospital1.save();
    console.log(`✅ ${doctors1Data.length} doctors added to Apollo Hospital`);

    // 6. Create Doctors for Fortis
    const doctors2Data = [
      { name: 'Dr. Sonia Gupta', email: 'sonia@fortis.com', specialization: 'Oncology', qualification: 'MBBS, MD Oncology', experience: 18, fee: 2000 },
      { name: 'Dr. Rahul Joshi', email: 'rahul@fortis.com', specialization: 'Cardiology', qualification: 'MBBS, DM Cardiology', experience: 14, fee: 1800 },
      { name: 'Dr. Kavita Menon', email: 'kavita@fortis.com', specialization: 'Dermatology', qualification: 'MBBS, MD Dermatology', experience: 9, fee: 900 },
    ];

    for (const doc of doctors2Data) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: 'doctor123',
        role: 'doctor',
        hospital: hospital2._id,
        phone: '+91 92000' + Math.floor(10000 + Math.random() * 90000),
      });

      await DoctorProfile.create({
        user: user._id,
        hospital: hospital2._id,
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        consultationFee: doc.fee,
        bio: `Leading ${doc.specialization} expert with ${doc.experience} years of experience.`,
        languages: ['English', 'Hindi'],
        schedule: defaultSchedule,
        isVerified: true,
        isAcceptingAppointments: true,
      });
    }

    hospital2.totalDoctors = doctors2Data.length;
    await hospital2.save();
    console.log(`✅ ${doctors2Data.length} doctors added to Fortis Hospital`);

    // 7. Create Departments
    const deptNames1 = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Dermatology'];
    for (const name of deptNames1) {
      await Department.create({ hospital: hospital1._id, name, description: `${name} department at Apollo Hospital` });
    }
    console.log('✅ Departments created for Apollo');

    const deptNames2 = ['Cardiology', 'Oncology', 'Dermatology', 'Neurosurgery', 'Urology'];
    for (const name of deptNames2) {
      await Department.create({ hospital: hospital2._id, name, description: `${name} department at Fortis Hospital` });
    }
    console.log('✅ Departments created for Fortis');

    // 8. Create Test Patients
    const patients = [
      { name: 'Rohit Sharma', email: 'rohit@gmail.com', phone: '+91 9800000001', gender: 'male', bloodGroup: 'O+' },
      { name: 'Sneha Iyer', email: 'sneha@gmail.com', phone: '+91 9800000002', gender: 'female', bloodGroup: 'A+' },
      { name: 'Karan Malhotra', email: 'karan@gmail.com', phone: '+91 9800000003', gender: 'male', bloodGroup: 'B+' },
    ];

    for (const p of patients) {
      await User.create({ ...p, password: 'patient123', role: 'patient' });
    }
    console.log('✅ 3 test patients created');

    // Summary
    console.log('\n═══════════════════════════════════════════');
    console.log('🎉 Seeding complete! Test credentials:');
    console.log('═══════════════════════════════════════════');
    console.log('Super Admin:    admin@healthcarepro.com / admin123');
    console.log('Hospital Admin: rajesh@apollo.com / hospital123');
    console.log('Hospital Admin: priya@fortis.com / hospital123');
    console.log('Doctor:         ananya@apollo.com / doctor123');
    console.log('Patient:        rohit@gmail.com / patient123');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
