import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import DoctorProfile from '../models/DoctorProfile.js';
import Department from '../models/Department.js';
import Appointment from '../models/Appointment.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database with custom demo datasets...\n');

    // Clear existing data
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await DoctorProfile.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});

    // 1. Create Super Admin
    await User.create({
      name: 'Platform Admin',
      email: 'admin@healthcarepro.com',
      password: 'admin123',
      role: 'superAdmin',
      phone: '+91 9000000000',
    });
    console.log('✅ Super Admin created: admin@healthcarepro.com');

    // 2. Create 5 Hospital Admins
    const adminData = [
      { name: 'Rajesh Kumar', email: 'rajesh@apollo.com', phone: '+91 9100000001' },
      { name: 'Priya Sharma', email: 'priya@fortis.com', phone: '+91 9100000002' },
      { name: 'Sanjay Dutt', email: 'sanjay@max.com', phone: '+91 9100000003' },
      { name: 'Deepak Chopra', email: 'deepak@manipal.com', phone: '+91 9100000004' },
      { name: 'Anil Kapoor', email: 'anil@kokilaben.com', phone: '+91 9100000005' }
    ];

    const admins = [];
    for (const admin of adminData) {
      const createdAdmin = await User.create({
        name: admin.name,
        email: admin.email,
        password: 'hospital123',
        role: 'hospitalAdmin',
        phone: admin.phone
      });
      admins.push(createdAdmin);
    }
    console.log('✅ 5 Hospital Admins created (Password: hospital123)');

    // 3. Create 5 Hospitals
    const hospitalData = [
      {
        name: 'Apollo Multi-Specialty Hospital',
        email: 'info@apollo.com',
        phone: '+91 44 2829 3333',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600006',
        specialties: ['Cardiology', 'Pediatrics'],
        registeredBy: admins[0]._id
      },
      {
        name: 'Fortis Memorial Research Institute',
        email: 'info@fortis.com',
        phone: '+91 124 4962 200',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        specialties: ['Cardiology', 'Pediatrics'],
        registeredBy: admins[1]._id
      },
      {
        name: 'Max Super Speciality Hospital',
        email: 'info@max.com',
        phone: '+91 11 2651 5050',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110017',
        specialties: ['Cardiology', 'Pediatrics'],
        registeredBy: admins[2]._id
      },
      {
        name: 'Manipal Hospital',
        email: 'info@manipal.com',
        phone: '+91 80 2502 4444',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560017',
        specialties: ['Cardiology', 'Pediatrics'],
        registeredBy: admins[3]._id
      },
      {
        name: 'Kokilaben Dhirubhai Ambani Hospital',
        email: 'info@kokilaben.com',
        phone: '+91 22 3099 9999',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
        specialties: ['Cardiology', 'Pediatrics'],
        registeredBy: admins[4]._id
      }
    ];

    const hospitals = [];
    for (const h of hospitalData) {
      const createdHospital = await Hospital.create({
        name: h.name,
        email: h.email,
        phone: h.phone,
        description: `${h.name} is a leading healthcare group offering premium Multi-Specialty clinical care.`,
        address: {
          street: 'Main Hospital Boulevard',
          city: h.city,
          state: h.state,
          pincode: h.pincode,
          country: 'India',
        },
        specialties: h.specialties,
        facilities: ['ICU', 'Emergency', 'Pharmacy', 'Lab', 'Radiology'],
        emergencyServices: true,
        ambulanceService: true,
        bedCount: 250,
        operatingHours: { open: '00:00', close: '23:59', is24x7: true },
        status: 'approved',
        isFeatured: true,
        registeredBy: h.registeredBy
      });
      hospitals.push(createdHospital);
    }
    console.log('✅ 5 Hospitals created');

    // Link admins to hospitals
    for (let i = 0; i < 5; i++) {
      admins[i].hospital = hospitals[i]._id;
      await admins[i].save();
    }

    // 4. Create Departments (Cardiology & Pediatrics for each hospital)
    const departments = [];
    for (const hosp of hospitals) {
      const cardio = await Department.create({
        hospital: hosp._id,
        name: 'Cardiology',
        description: 'Advanced Cardiology and Cardiovascular Care.'
      });
      const pedia = await Department.create({
        hospital: hosp._id,
        name: 'Pediatrics',
        description: 'General and Intensive Pediatric clinical care.'
      });
      departments.push(cardio, pedia);
    }
    console.log('✅ 10 Departments created (Cardiology & Pediatrics for each hospital)');

    // 5. Create 10 Doctors (1 for Cardiology, 1 for Pediatrics at each hospital)
    const doctorData = [
      { name: 'Dr. Ananya Verma', email: 'ananya@apollo.com', specialization: 'Cardiology', fee: 1200 },
      { name: 'Dr. Arjun Reddy', email: 'arjun@apollo.com', specialization: 'Pediatrics', fee: 800 },
      
      { name: 'Dr. Rahul Joshi', email: 'rahul@fortis.com', specialization: 'Cardiology', fee: 1500 },
      { name: 'Dr. Sonia Gupta', email: 'sonia@fortis.com', specialization: 'Pediatrics', fee: 900 },
      
      { name: 'Dr. Sanjay Dutt', email: 'sanjaydutt@max.com', specialization: 'Cardiology', fee: 1300 },
      { name: 'Dr. Karan Johar', email: 'karan@max.com', specialization: 'Pediatrics', fee: 1000 },
      
      { name: 'Dr. Deepak Chopra', email: 'chopra@manipal.com', specialization: 'Cardiology', fee: 1400 },
      { name: 'Dr. Divya Spandana', email: 'divya@manipal.com', specialization: 'Pediatrics', fee: 950 },
      
      { name: 'Dr. Anil Kapoor', email: 'anilkapoor@kokilaben.com', specialization: 'Cardiology', fee: 1600 },
      { name: 'Dr. Madhuri Dixit', email: 'madhuri@kokilaben.com', specialization: 'Pediatrics', fee: 1100 }
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

    const doctors = [];
    for (let i = 0; i < doctorData.length; i++) {
      const doc = doctorData[i];
      const hosp = hospitals[Math.floor(i / 2)];
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: 'doctor123',
        role: 'doctor',
        hospital: hosp._id,
        phone: '+91 95000' + Math.floor(10000 + Math.random() * 90000),
      });

      await DoctorProfile.create({
        user: user._id,
        hospital: hosp._id,
        specialization: doc.specialization,
        qualification: 'MBBS, MD',
        experience: 8 + Math.floor(Math.random() * 12),
        consultationFee: doc.fee,
        bio: `Specialist in ${doc.specialization} at ${hosp.name}.`,
        languages: ['English', 'Hindi'],
        schedule: defaultSchedule,
        isVerified: true,
        isAcceptingAppointments: true,
      });

      doctors.push(user);
    }
    console.log('✅ 10 Doctors created (Password: doctor123)');

    // Set doctors counts on hospitals
    for (const h of hospitals) {
      h.totalDoctors = 2;
      await h.save();
    }

    // 6. Create 20 Patients
    const patients = [];
    for (let i = 1; i <= 20; i++) {
      const p = await User.create({
        name: `Patient User ${i}`,
        email: `patient${i}@gmail.com`,
        phone: `+91 98000000${i < 10 ? '0' + i : i}`,
        gender: i % 2 === 0 ? 'female' : 'male',
        bloodGroup: 'O+',
        password: 'patient123',
        role: 'patient'
      });
      patients.push(p);
    }
    console.log('✅ 20 Patients created (Password: patient123)');

    // 7. Book 10 Appointments linking Patients 1-10 with Doctors 1-10
    // Every doctor/department will have at least 1 booked patient appointment
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 5); // 5 days from now

    for (let i = 0; i < 10; i++) {
      const doc = doctors[i];
      const hosp = hospitals[Math.floor(i / 2)];
      const pat = patients[i];

      await Appointment.create({
        patient: pat._id,
        doctor: doc._id,
        hospital: hosp._id,
        hospitalName: hosp.name,
        roomOrClinic: 'Main OPD clinic room ' + (i + 1),
        date: appointmentDate,
        timeSlot: '10:00 AM',
        reason: 'Regular clinical checkup and consultation.',
        status: 'confirmed',
        consultationFee: doctorData[i].fee,
        isPaid: true
      });
    }
    console.log('✅ 10 Appointments created (linking every department to at least one patient)');

    console.log('\n🎉 Seeding complete! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
