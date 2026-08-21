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

    // 4. Create Departments (6 Departments for each of the 5 hospitals = 30 Departments)
    const departmentsMap = [
      { name: 'Cardiology', description: 'Advanced Interventional & Preventive Cardiovascular Medicine.' },
      { name: 'Pediatrics', description: 'Comprehensive Pediatric, Neonatal & Adolescent Care.' },
      { name: 'Neurology', description: 'Neurosurgery, Stroke Management & Neuro-Oncology.' },
      { name: 'Orthopedics', description: 'Robotic Joint Replacement, Arthroscopy & Trauma Care.' },
      { name: 'Dermatology', description: 'Clinical, Laser & Aesthetic Dermatology.' },
      { name: 'Gynecology', description: 'High Risk Obstetrics, Reproductive Medicine & Laparoscopy.' }
    ];

    for (const hosp of hospitals) {
      for (const dept of departmentsMap) {
        await Department.create({
          hospital: hosp._id,
          name: dept.name,
          description: dept.description
        });
      }
    }
    console.log('✅ 30 Departments created (6 departments for each hospital)');

    // 5. Create 30 Doctors (6 Doctors for each hospital)
    const doctorData = [
      // Apollo (Chennai)
      { name: 'Dr. Ananya Verma', email: 'ananya@apollo.com', specialization: 'Cardiology', fee: 1200, qualification: 'MBBS, MD, DM (Cardiology), FACC', exp: 14, hospIdx: 0 },
      { name: 'Dr. Arjun Reddy', email: 'arjun@apollo.com', specialization: 'Pediatrics', fee: 800, qualification: 'MBBS, MD (Pediatrics), DNB', exp: 10, hospIdx: 0 },
      { name: 'Dr. Siddharth Mukherjee', email: 'siddharth@apollo.com', specialization: 'Neurology', fee: 1500, qualification: 'MBBS, MS, MCh (Neurosurgery)', exp: 16, hospIdx: 0 },
      { name: 'Dr. Meera Nambiar', email: 'meera@apollo.com', specialization: 'Orthopedics', fee: 1100, qualification: 'MBBS, MS (Orthopedics), Joint Replacement Fellow', exp: 12, hospIdx: 0 },
      { name: 'Dr. Rajesh Varma', email: 'rajeshvarma@apollo.com', specialization: 'General Medicine', fee: 700, qualification: 'MBBS, MD (Internal Medicine)', exp: 15, hospIdx: 0 },
      { name: 'Dr. Swati Deshmukh', email: 'swati@apollo.com', specialization: 'Dermatology', fee: 900, qualification: 'MBBS, MD (Dermatology)', exp: 8, hospIdx: 0 },
      
      // Fortis (Gurugram)
      { name: 'Dr. Rahul Joshi', email: 'rahul@fortis.com', specialization: 'Cardiology', fee: 1500, qualification: 'MBBS, MD, DM (Cardiology), FACC', exp: 18, hospIdx: 1 },
      { name: 'Dr. Sonia Gupta', email: 'sonia@fortis.com', specialization: 'Pediatrics', fee: 900, qualification: 'MBBS, DCH, DNB (Pediatrics)', exp: 11, hospIdx: 1 },
      { name: 'Dr. Vikramaditya Singh', email: 'vikram@fortis.com', specialization: 'Oncology', fee: 1800, qualification: 'MBBS, MD, DM (Medical Oncology)', exp: 15, hospIdx: 1 },
      { name: 'Dr. Neha Kapoor', email: 'neha@fortis.com', specialization: 'Gynecology', fee: 1200, qualification: 'MBBS, MS (OBG), Laparoscopic Surgeon', exp: 13, hospIdx: 1 },
      { name: 'Dr. Arvind Kejriwal', email: 'arvind@fortis.com', specialization: 'Gastroenterology', fee: 1400, qualification: 'MBBS, MD, DM (Gastroenterology)', exp: 14, hospIdx: 1 },
      { name: 'Dr. Tanvi Shah', email: 'tanvi@fortis.com', specialization: 'ENT', fee: 850, qualification: 'MBBS, MS (ENT - Otorhinolaryngology)', exp: 9, hospIdx: 1 },

      // Max (Delhi)
      { name: 'Dr. Sanjay Dutt', email: 'sanjaydutt@max.com', specialization: 'Cardiology', fee: 1300, qualification: 'MBBS, MS, MCh (CTVS), Chief Cardiac Surgeon', exp: 20, hospIdx: 2 },
      { name: 'Dr. Karan Johar', email: 'karan@max.com', specialization: 'Pediatrics', fee: 1000, qualification: 'MBBS, MD (Pediatrics), PICU Specialist', exp: 12, hospIdx: 2 },
      { name: 'Dr. Alok Nath', email: 'alok@max.com', specialization: 'Neurology', fee: 1600, qualification: 'MBBS, MD, DM (Neurology)', exp: 17, hospIdx: 2 },
      { name: 'Dr. Pooja Hegde', email: 'pooja@max.com', specialization: 'Dermatology', fee: 950, qualification: 'MBBS, MD (Dermatology), Aesthetic Specialist', exp: 10, hospIdx: 2 },
      { name: 'Dr. Rohit Sharma', email: 'rohit@max.com', specialization: 'Orthopedics', fee: 1250, qualification: 'MBBS, MS (Ortho), Sports Medicine Fellow', exp: 14, hospIdx: 2 },
      { name: 'Dr. Sunita Rao', email: 'sunita@max.com', specialization: 'Endocrinology', fee: 1150, qualification: 'MBBS, MD, DM (Endocrinology)', exp: 11, hospIdx: 2 },

      // Manipal (Bengaluru)
      { name: 'Dr. Deepak Chopra', email: 'chopra@manipal.com', specialization: 'Cardiology', fee: 1400, qualification: 'MBBS, MD, DM (Cardiology)', exp: 16, hospIdx: 3 },
      { name: 'Dr. Divya Spandana', email: 'divya@manipal.com', specialization: 'Pediatrics', fee: 950, qualification: 'MBBS, MD (Pediatrics), Pulmonology Specialist', exp: 10, hospIdx: 3 },
      { name: 'Dr. Raghavendra Rao', email: 'raghav@manipal.com', specialization: 'Nephrology', fee: 1700, qualification: 'MBBS, MD, DM (Nephrology), Renal Transplant Lead', exp: 18, hospIdx: 3 },
      { name: 'Dr. Shalini Sundaram', email: 'shalini@manipal.com', specialization: 'Gynecology', fee: 1300, qualification: 'MBBS, DGO, DNB, IVF & Infertility Specialist', exp: 13, hospIdx: 3 },
      { name: 'Dr. Chetan Bhagat', email: 'chetan@manipal.com', specialization: 'Psychiatry', fee: 1100, qualification: 'MBBS, MD (Psychiatry)', exp: 12, hospIdx: 3 },
      { name: 'Dr. Ananya Panday', email: 'ananyapanday@manipal.com', specialization: 'General Surgery', fee: 1050, qualification: 'MBBS, MS (Gen Surgery), FIAGES', exp: 9, hospIdx: 3 },

      // Kokilaben (Mumbai)
      { name: 'Dr. Anil Kapoor', email: 'anilkapoor@kokilaben.com', specialization: 'Cardiology', fee: 1600, qualification: 'MBBS, MD, DM (Cardiology), FSCAI', exp: 22, hospIdx: 4 },
      { name: 'Dr. Madhuri Dixit', email: 'madhuri@kokilaben.com', specialization: 'Pediatrics', fee: 1100, qualification: 'MBBS, MD (Pediatrics), Developmental Specialist', exp: 15, hospIdx: 4 },
      { name: 'Dr. Shah Rukh Khan', email: 'shahrukh@kokilaben.com', specialization: 'Neurology', fee: 2000, qualification: 'MBBS, MS, MCh (Neurosurgery), Spine Specialist', exp: 19, hospIdx: 4 },
      { name: 'Dr. Kareena Kapoor', email: 'kareena@kokilaben.com', specialization: 'Dermatology', fee: 1200, qualification: 'MBBS, DVD, MD (Dermatology)', exp: 11, hospIdx: 4 },
      { name: 'Dr. Ranveer Singh', email: 'ranveer@kokilaben.com', specialization: 'Orthopedics', fee: 1350, qualification: 'MBBS, MS (Orthopedics), Joint Reconstruction', exp: 13, hospIdx: 4 },
      { name: 'Dr. Deepika Padukone', email: 'deepika@kokilaben.com', specialization: 'Ophthalmology', fee: 1000, qualification: 'MBBS, MS (Ophthalmology), LASIK & Cornea Fellow', exp: 12, hospIdx: 4 }
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
      const hosp = hospitals[doc.hospIdx];
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
        qualification: doc.qualification,
        experience: doc.exp,
        consultationFee: doc.fee,
        bio: `Specialist in ${doc.specialization} at ${hosp.name}.`,
        languages: ['English', 'Hindi'],
        schedule: defaultSchedule,
        isVerified: true,
        isAcceptingAppointments: true,
      });

      doctors.push(user);
    }
    console.log('✅ 30 Doctors created across all 5 hospitals (Password: doctor123)');

    // Set doctors counts on hospitals
    for (const h of hospitals) {
      h.totalDoctors = 6;
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

    // 7. Book Appointments linking Patients with Doctors
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 5);

    for (let i = 0; i < 20; i++) {
      const doc = doctors[i];
      const hosp = hospitals[Math.floor(i / 6)];
      const pat = patients[i];

      await Appointment.create({
        patient: pat._id,
        doctor: doc._id,
        hospital: hosp._id,
        hospitalName: hosp.name,
        roomOrClinic: 'OPD Consultation Room ' + ((i % 6) + 1),
        date: appointmentDate,
        timeSlot: '10:00 AM',
        reason: 'Regular clinical checkup and specialized consultation.',
        status: 'confirmed',
        consultationFee: doctorData[i].fee,
        isPaid: true
      });
    }
    console.log('✅ 20 Appointments created (linking patients to doctors in all hospitals)');

    console.log('\n🎉 Seeding complete! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
