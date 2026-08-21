export const DEMO_CITIES = ['Chennai', 'Gurugram', 'Delhi', 'Bengaluru', 'Mumbai'];

export const DEMO_HOSPITALS = [
  {
    _id: 'hosp_apollo',
    name: 'Apollo Multi-Specialty Hospital',
    slug: 'apollo-multi-specialty-hospital',
    email: 'info@apollo.com',
    phone: '+91 44 2829 3333',
    description: 'Apollo Multi-Specialty Hospital Chennai is a world-renowned tertiary care facility renowned for pioneering cardiac sciences, robotic surgery, pediatric interventions, and oncology.',
    address: {
      street: '21 Greams Lane, Thousand Lights',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600006',
      country: 'India'
    },
    specialties: ['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'General Medicine', 'Dermatology'],
    facilities: ['ICU', '24x7 Emergency', 'Pharmacy', 'Robotic Surgery', 'Radiology', 'Blood Bank', 'Ambulance'],
    emergencyServices: true,
    ambulanceService: true,
    bedCount: 650,
    rating: 4.9,
    numReviews: 128,
    operatingHours: { open: '00:00', close: '23:59', is24x7: true },
    status: 'approved',
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'hosp_fortis',
    name: 'Fortis Memorial Research Institute',
    slug: 'fortis-memorial-research-institute',
    email: 'info@fortis.com',
    phone: '+91 124 4962 200',
    description: 'Fortis Memorial Research Institute (FMRI) is a premium multi-super-speciality quaternary care hospital with internationally trained faculty and state-of-the-art diagnostic labs.',
    address: {
      street: 'Sector 44, Opposite HUDA City Centre',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      country: 'India'
    },
    specialties: ['Cardiology', 'Pediatrics', 'Oncology', 'Gynecology', 'Gastroenterology', 'ENT'],
    facilities: ['Cath Lab', 'Level-1 Trauma Center', 'PET-CT Scan', 'NICU / PICU', 'Pharmacy', 'Ambulance'],
    emergencyServices: true,
    ambulanceService: true,
    bedCount: 400,
    rating: 4.8,
    numReviews: 94,
    operatingHours: { open: '00:00', close: '23:59', is24x7: true },
    status: 'approved',
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'hosp_max',
    name: 'Max Super Speciality Hospital',
    slug: 'max-super-speciality-hospital',
    email: 'info@max.com',
    phone: '+91 11 2651 5050',
    description: 'Max Super Speciality Hospital Saket is an NABH & JCI accredited healthcare provider offering leading clinical expertise in heart transplants, neurosciences, and orthopedics.',
    address: {
      street: '1, 2 Press Enclave Road, Saket',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110017',
      country: 'India'
    },
    specialties: ['Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'Orthopedics', 'Endocrinology'],
    facilities: ['Emergency Room', 'Modular OTs', '24x7 Dialysis', 'Advanced MRI 3T', 'Cafeteria', 'Ambulance'],
    emergencyServices: true,
    ambulanceService: true,
    bedCount: 500,
    rating: 4.9,
    numReviews: 112,
    operatingHours: { open: '00:00', close: '23:59', is24x7: true },
    status: 'approved',
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'hosp_manipal',
    name: 'Manipal Hospital',
    slug: 'manipal-hospital',
    email: 'info@manipal.com',
    phone: '+91 80 2502 4444',
    description: 'Manipal Hospital HAL Old Airport Road is a flagship hospital pioneer in organ transplants, nephrology, maternal care, and minimally invasive general surgery.',
    address: {
      street: '98, HAL Old Airport Road, Kodihalli',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560017',
      country: 'India'
    },
    specialties: ['Cardiology', 'Pediatrics', 'Nephrology', 'Gynecology', 'Psychiatry', 'General Surgery'],
    facilities: ['Renal Transplant Unit', 'ICU', '24x7 Pharmacy', 'Diagnostic Imaging', 'Helipad', 'Ambulance'],
    emergencyServices: true,
    ambulanceService: true,
    bedCount: 600,
    rating: 4.7,
    numReviews: 87,
    operatingHours: { open: '00:00', close: '23:59', is24x7: true },
    status: 'approved',
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 'hosp_kokilaben',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    slug: 'kokilaben-dhirubhai-ambani-hospital',
    email: 'info@kokilaben.com',
    phone: '+91 22 3099 9999',
    description: 'Kokilaben Dhirubhai Ambani Hospital & Medical Research Institute Mumbai is an ultra-modern multi-specialty institute featuring Full Time Specialist System (FTSS) care.',
    address: {
      street: 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      country: 'India'
    },
    specialties: ['Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'Orthopedics', 'Ophthalmology'],
    facilities: ['Intra-operative MRI 3T', 'EDGE Radiosurgery', 'Pediatric ICU', 'Emergency 24x7', 'Ambulance'],
    emergencyServices: true,
    ambulanceService: true,
    bedCount: 750,
    rating: 5.0,
    numReviews: 156,
    operatingHours: { open: '00:00', close: '23:59', is24x7: true },
    status: 'approved',
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'
  }
];

const defaultWeekSchedule = [
  { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
  { day: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
  { day: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
  { day: 'Thursday', startTime: '09:00', endTime: '17:00', slotDuration: 30, maxPatients: 16, isAvailable: true },
  { day: 'Friday', startTime: '09:00', endTime: '14:00', slotDuration: 30, maxPatients: 10, isAvailable: true },
  { day: 'Saturday', startTime: '10:00', endTime: '13:00', slotDuration: 30, maxPatients: 6, isAvailable: true },
  { day: 'Sunday', startTime: '10:00', endTime: '13:00', slotDuration: 30, maxPatients: 6, isAvailable: false },
];

export const DEMO_DOCTORS = [
  // 🏥 Apollo Hospital (Chennai)
  {
    _id: 'doc_ananya',
    user: { _id: 'user_ananya', name: 'Dr. Ananya Verma', email: 'ananya@apollo.com', phone: '+91 9500012345' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[0],
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology), DM, FACC',
    experience: 14,
    consultationFee: 1200,
    bio: 'Senior Interventional Cardiologist specializing in complex coronary interventions, heart failure management, and preventive cardiac wellness.',
    languages: ['English', 'Hindi', 'Tamil'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 48,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_arjun',
    user: { _id: 'user_arjun', name: 'Dr. Arjun Reddy', email: 'arjun@apollo.com', phone: '+91 9500012346' },
    avatar: '/images/doctors/doc_male_1.jpg',
    hospital: DEMO_HOSPITALS[0],
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics), DNB',
    experience: 10,
    consultationFee: 800,
    bio: 'Consultant Pediatrician and Neonatologist with extensive clinical expertise in childhood growth, immunizations, and neonatal intensive care.',
    languages: ['English', 'Telugu', 'Tamil'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 36,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_siddharth',
    user: { _id: 'user_siddharth', name: 'Dr. Siddharth Mukherjee', email: 'siddharth@apollo.com', phone: '+91 9500012347' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[0],
    specialization: 'Neurology',
    qualification: 'MBBS, MS, MCh (Neurosurgery)',
    experience: 16,
    consultationFee: 1500,
    bio: 'Renowned Neurosurgeon specializing in minimally invasive brain surgery, spinal fusion, and neuro-vascular oncology.',
    languages: ['English', 'Bengali', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 5.0,
    numReviews: 42,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_meera',
    user: { _id: 'user_meera', name: 'Dr. Meera Nambiar', email: 'meera@apollo.com', phone: '+91 9500012348' },
    avatar: '/images/doctors/doc_female_2.jpg',
    hospital: DEMO_HOSPITALS[0],
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Orthopedics), Fellowship in Joint Replacement (UK)',
    experience: 12,
    consultationFee: 1100,
    bio: 'Orthopedic and Robotic Joint Replacement Surgeon specializing in total knee, hip replacements, and sports arthroscopy.',
    languages: ['English', 'Malayalam', 'Tamil'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 29,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_rajesh',
    user: { _id: 'user_rajesh', name: 'Dr. Rajesh Varma', email: 'rajeshvarma@apollo.com', phone: '+91 9500012349' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[0],
    specialization: 'General Medicine',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: 15,
    consultationFee: 700,
    bio: 'Lead Internal Medicine Specialist with expertise in diabetes, hypertension, infectious diseases, and comprehensive health checkups.',
    languages: ['English', 'Hindi', 'Tamil'],
    schedule: defaultWeekSchedule,
    rating: 4.7,
    numReviews: 53,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_swati',
    user: { _id: 'user_swati', name: 'Dr. Swati Deshmukh', email: 'swati@apollo.com', phone: '+91 9500012350' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[0],
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology & Venereology)',
    experience: 8,
    consultationFee: 900,
    bio: 'Clinical and Cosmetic Dermatologist specializing in laser treatments, acne management, psoriasis, and anti-aging therapies.',
    languages: ['English', 'Marathi', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 31,
    isVerified: true,
    isAcceptingAppointments: true
  },

  // 🏥 Fortis Memorial Research Institute (Gurugram)
  {
    _id: 'doc_rahul',
    user: { _id: 'user_rahul', name: 'Dr. Rahul Joshi', email: 'rahul@fortis.com', phone: '+91 9500022345' },
    avatar: '/images/doctors/doc_male_1.jpg',
    hospital: DEMO_HOSPITALS[1],
    specialization: 'Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology), FACC',
    experience: 18,
    consultationFee: 1500,
    bio: 'Director of Interventional Cardiology with over 4,000 successful angioplasties, pacemaker implants, and TAVR procedures.',
    languages: ['English', 'Hindi', 'Punjabi'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 62,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_sonia',
    user: { _id: 'user_sonia', name: 'Dr. Sonia Gupta', email: 'sonia@fortis.com', phone: '+91 9500022346' },
    avatar: '/images/doctors/doc_female_2.jpg',
    hospital: DEMO_HOSPITALS[1],
    specialization: 'Pediatrics',
    qualification: 'MBBS, DCH, DNB (Pediatrics)',
    experience: 11,
    consultationFee: 900,
    bio: 'Senior Consultant Pediatrician focusing on pediatric allergies, developmental milestones, nutrition, and infectious illnesses.',
    languages: ['English', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 40,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_vikram',
    user: { _id: 'user_vikram', name: 'Dr. Vikramaditya Singh', email: 'vikram@fortis.com', phone: '+91 9500022347' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[1],
    specialization: 'Oncology',
    qualification: 'MBBS, MD, DM (Medical Oncology), ESMO Certified',
    experience: 15,
    consultationFee: 1800,
    bio: 'Chief Medical Oncologist with expertise in precision oncology, immunotherapy, targeted therapies, and hematological malignancies.',
    languages: ['English', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 5.0,
    numReviews: 55,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_neha',
    user: { _id: 'user_neha', name: 'Dr. Neha Kapoor', email: 'neha@fortis.com', phone: '+91 9500022348' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[1],
    specialization: 'Gynecology',
    qualification: 'MBBS, MS (Obstetrics & Gynecology), Fellowship in Laparoscopy',
    experience: 13,
    consultationFee: 1200,
    bio: 'Senior Obstetrician and Gynecological Surgeon specializing in high-risk pregnancies, laparoscopic hysterectomy, and PCOS care.',
    languages: ['English', 'Hindi', 'Punjabi'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 47,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_arvind',
    user: { _id: 'user_arvind', name: 'Dr. Arvind Kejriwal', email: 'arvind@fortis.com', phone: '+91 9500022349' },
    avatar: '/images/doctors/doc_male_1.jpg',
    hospital: DEMO_HOSPITALS[1],
    specialization: 'Gastroenterology',
    qualification: 'MBBS, MD, DM (Gastroenterology)',
    experience: 14,
    consultationFee: 1400,
    bio: 'Consultant Gastroenterologist and Hepatologist specializing in endoscopy, colonoscopy, fatty liver disease, and IBD.',
    languages: ['English', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.7,
    numReviews: 38,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_tanvi',
    user: { _id: 'user_tanvi', name: 'Dr. Tanvi Shah', email: 'tanvi@fortis.com', phone: '+91 9500022350' },
    avatar: '/images/doctors/doc_female_2.jpg',
    hospital: DEMO_HOSPITALS[1],
    specialization: 'ENT',
    qualification: 'MBBS, MS (ENT - Otorhinolaryngology)',
    experience: 9,
    consultationFee: 850,
    bio: 'ENT and Cochlear Implant Surgeon specialized in endoscopic sinus surgery, vertigo management, and pediatric hearing disorders.',
    languages: ['English', 'Gujarati', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 24,
    isVerified: true,
    isAcceptingAppointments: true
  },

  // 🏥 Max Super Speciality Hospital (Delhi)
  {
    _id: 'doc_sanjaydutt',
    user: { _id: 'user_sanjaydutt', name: 'Dr. Sanjay Dutt', email: 'sanjaydutt@max.com', phone: '+91 9500032345' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[2],
    specialization: 'Cardiology',
    qualification: 'MBBS, MS, MCh (CTVS), Chief Cardiac Surgeon',
    experience: 20,
    consultationFee: 1300,
    bio: 'Chief Cardiovascular & Thoracic Surgeon with over 6,000 open heart, bypass, and valve replacement surgeries performed.',
    languages: ['English', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 73,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_karan',
    user: { _id: 'user_karan', name: 'Dr. Karan Johar', email: 'karan@max.com', phone: '+91 9500032346' },
    avatar: '/images/doctors/doc_male_1.jpg',
    hospital: DEMO_HOSPITALS[2],
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics), Fellowship in Pediatric Critical Care',
    experience: 12,
    consultationFee: 1000,
    bio: 'Pediatric Intensive Care Consultant specializing in childhood asthma, acute infections, newborn health, and immunization programs.',
    languages: ['English', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 39,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_alok',
    user: { _id: 'user_alok', name: 'Dr. Alok Nath', email: 'alok@max.com', phone: '+91 9500032347' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[2],
    specialization: 'Neurology',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: 17,
    consultationFee: 1600,
    bio: 'Senior Neurologist with extensive expertise in acute stroke intervention, Parkinson’s disease, migraine, and epilepsy management.',
    languages: ['English', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 5.0,
    numReviews: 61,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_pooja',
    user: { _id: 'user_pooja', name: 'Dr. Pooja Hegde', email: 'pooja@max.com', phone: '+91 9500032348' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[2],
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology), Cosmetology Specialist',
    experience: 10,
    consultationFee: 950,
    bio: 'Cosmetic Dermatologist and Hair Transplant Surgeon specializing in PRP treatments, scar revision, and advanced skin care.',
    languages: ['English', 'Kannada', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 44,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_rohit',
    user: { _id: 'user_rohit', name: 'Dr. Rohit Sharma', email: 'rohit@max.com', phone: '+91 9500032349' },
    avatar: '/images/doctors/doc_male_1.jpg',
    hospital: DEMO_HOSPITALS[2],
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho), Fellowship in Sports Medicine',
    experience: 14,
    consultationFee: 1250,
    bio: 'Sports Injury Specialist and Orthopedic Surgeon dealing with ligament tears (ACL/PCL), meniscus repair, and shoulder arthroscopy.',
    languages: ['English', 'Hindi', 'Marathi'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 50,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_sunita',
    user: { _id: 'user_sunita', name: 'Dr. Sunita Rao', email: 'sunita@max.com', phone: '+91 9500032350' },
    avatar: '/images/doctors/doc_female_2.jpg',
    hospital: DEMO_HOSPITALS[2],
    specialization: 'Endocrinology',
    qualification: 'MBBS, MD, DM (Endocrinology)',
    experience: 11,
    consultationFee: 1150,
    bio: 'Consultant Endocrinologist managing complex Type 1 and Type 2 diabetes, thyroid conditions, hormonal imbalances, and pituitary disorders.',
    languages: ['English', 'Telugu', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.7,
    numReviews: 28,
    isVerified: true,
    isAcceptingAppointments: true
  },

  // 🏥 Manipal Hospital (Bengaluru)
  {
    _id: 'doc_chopra',
    user: { _id: 'user_chopra', name: 'Dr. Deepak Chopra', email: 'chopra@manipal.com', phone: '+91 9500042345' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[3],
    specialization: 'Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology), Preventive Cardiology Lead',
    experience: 16,
    consultationFee: 1400,
    bio: 'Preventive Cardiologist focusing on lifestyle-guided reversal of coronary artery disease, heart failure clinic, and cardiac rehabilitation.',
    languages: ['English', 'Hindi', 'Kannada'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 58,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_divya',
    user: { _id: 'user_divya', name: 'Dr. Divya Spandana', email: 'divya@manipal.com', phone: '+91 9500042346' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[3],
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics), Fellowship in Pediatric Pulmonology',
    experience: 10,
    consultationFee: 950,
    bio: 'Pediatric Pulmonologist specializing in childhood recurrent cough, respiratory infections, allergies, and pediatric sleep disorders.',
    languages: ['English', 'Kannada', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 35,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_raghav',
    user: { _id: 'user_raghav', name: 'Dr. Raghavendra Rao', email: 'raghav@manipal.com', phone: '+91 9500042347' },
    avatar: '/images/doctors/doc_male_1.jpg',
    hospital: DEMO_HOSPITALS[3],
    specialization: 'Nephrology',
    qualification: 'MBBS, MD, DM (Nephrology), Kidney Transplant Surgeon',
    experience: 18,
    consultationFee: 1700,
    bio: 'Senior Nephrologist and Renal Transplant Physician with over 1,200 kidney transplants and advanced dialysis care managed.',
    languages: ['English', 'Kannada', 'Telugu'],
    schedule: defaultWeekSchedule,
    rating: 5.0,
    numReviews: 67,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_shalini',
    user: { _id: 'user_shalini', name: 'Dr. Shalini Sundaram', email: 'shalini@manipal.com', phone: '+91 9500042348' },
    avatar: '/images/doctors/doc_female_2.jpg',
    hospital: DEMO_HOSPITALS[3],
    specialization: 'Gynecology',
    qualification: 'MBBS, DGO, DNB, Fellowship in Reproductive Medicine',
    experience: 13,
    consultationFee: 1300,
    bio: 'Reproductive Medicine & Infertility Specialist helping couples with IVF, IUI, recurrent miscarriage treatments, and laparoscopic fertility surgery.',
    languages: ['English', 'Tamil', 'Kannada'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 49,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_chetan',
    user: { _id: 'user_chetan', name: 'Dr. Chetan Bhagat', email: 'chetan@manipal.com', phone: '+91 9500042349' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[3],
    specialization: 'Psychiatry',
    qualification: 'MBBS, MD (Psychiatry), Behavioral Medicine Consultant',
    experience: 12,
    consultationFee: 1100,
    bio: 'Consultant Psychiatrist providing compassionate care for clinical anxiety, depression, workplace stress, ADHD, and psychotherapy.',
    languages: ['English', 'Hindi', 'Kannada'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 41,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_ananyapanday',
    user: { _id: 'user_ananyapanday', name: 'Dr. Ananya Panday', email: 'ananyapanday@manipal.com', phone: '+91 9500042350' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[3],
    specialization: 'General Surgery',
    qualification: 'MBBS, MS (General Surgery), FIAGES (Laparoscopic Surgery)',
    experience: 9,
    consultationFee: 1050,
    bio: 'Minimally Invasive & Bariatric Surgeon specializing in laparoscopic gall bladder, hernia repair, appendix surgery, and weight-loss interventions.',
    languages: ['English', 'Hindi', 'Marathi'],
    schedule: defaultWeekSchedule,
    rating: 4.7,
    numReviews: 30,
    isVerified: true,
    isAcceptingAppointments: true
  },

  // 🏥 Kokilaben Dhirubhai Ambani Hospital (Mumbai)
  {
    _id: 'doc_anilkapoor',
    user: { _id: 'user_anilkapoor', name: 'Dr. Anil Kapoor', email: 'anilkapoor@kokilaben.com', phone: '+91 9500052345' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[4],
    specialization: 'Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology), FSCAI (USA)',
    experience: 22,
    consultationFee: 1600,
    bio: 'Senior Consultant Interventional Cardiologist with over two decades of experience in complex angioplasty, heart failure, and structural heart care.',
    languages: ['English', 'Hindi', 'Gujarati'],
    schedule: defaultWeekSchedule,
    rating: 5.0,
    numReviews: 89,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_madhuri',
    user: { _id: 'user_madhuri', name: 'Dr. Madhuri Dixit', email: 'madhuri@kokilaben.com', phone: '+91 9500052346' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[4],
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics), Developmental Pediatrics Specialist',
    experience: 15,
    consultationFee: 1100,
    bio: 'Developmental & Behavioral Pediatrician focusing on early childhood development, pediatric nutrition, autism support, and routine wellness.',
    languages: ['English', 'Marathi', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 54,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_shahrukh',
    user: { _id: 'user_shahrukh', name: 'Dr. Shah Rukh Khan', email: 'shahrukh@kokilaben.com', phone: '+91 9500052347' },
    avatar: '/images/doctors/doc_male_2.jpg',
    hospital: DEMO_HOSPITALS[4],
    specialization: 'Neurology',
    qualification: 'MBBS, MS, MCh (Neurosurgery), Spine Specialist',
    experience: 19,
    consultationFee: 2000,
    bio: 'Lead Neuro-Oncologist & Minimally Invasive Spine Surgeon specializing in skull-base tumors, endoscopic spinal surgery, and brain bypass.',
    languages: ['English', 'Hindi', 'Urdu'],
    schedule: defaultWeekSchedule,
    rating: 5.0,
    numReviews: 98,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_kareena',
    user: { _id: 'user_kareena', name: 'Dr. Kareena Kapoor', email: 'kareena@kokilaben.com', phone: '+91 9500052348' },
    avatar: '/images/doctors/doc_female_2.jpg',
    hospital: DEMO_HOSPITALS[4],
    specialization: 'Dermatology',
    qualification: 'MBBS, DVD, MD (Dermatology), Aesthetic Medicine Fellow',
    experience: 11,
    consultationFee: 1200,
    bio: 'Senior Dermatologist specializing in laser dermatology, pigmentation treatments, eczema, hair loss therapies, and medical aesthetics.',
    languages: ['English', 'Hindi', 'Punjabi'],
    schedule: defaultWeekSchedule,
    rating: 4.8,
    numReviews: 46,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_ranveer',
    user: { _id: 'user_ranveer', name: 'Dr. Ranveer Singh', email: 'ranveer@kokilaben.com', phone: '+91 9500052349' },
    avatar: '/images/doctors/doc_male_1.jpg',
    hospital: DEMO_HOSPITALS[4],
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Orthopedics), AO Trauma Fellow',
    experience: 13,
    consultationFee: 1350,
    bio: 'Trauma & Complex Joint Reconstruction Surgeon with specialized focus on sports medicine, fracture care, and robotic knee arthroplasty.',
    languages: ['English', 'Hindi', 'Sindhi'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 52,
    isVerified: true,
    isAcceptingAppointments: true
  },
  {
    _id: 'doc_deepika',
    user: { _id: 'user_deepika', name: 'Dr. Deepika Padukone', email: 'deepika@kokilaben.com', phone: '+91 9500052350' },
    avatar: '/images/doctors/doc_female_1.jpg',
    hospital: DEMO_HOSPITALS[4],
    specialization: 'Ophthalmology',
    qualification: 'MBBS, MS (Ophthalmology), Cornea & Refractive Fellow',
    experience: 12,
    consultationFee: 1000,
    bio: 'Cornea and Refractive Eye Surgeon with expertise in robotic blade-free LASIK, cataract phacoemulsification, and glaucoma management.',
    languages: ['English', 'Kannada', 'Hindi'],
    schedule: defaultWeekSchedule,
    rating: 4.9,
    numReviews: 60,
    isVerified: true,
    isAcceptingAppointments: true
  }
];

export const DEMO_DEPARTMENTS_BY_HOSPITAL = {
  hosp_apollo: [
    { _id: 'dept_apollo_1', name: 'Cardiology', description: 'Advanced Interventional & Preventive Cardiovascular Medicine' },
    { _id: 'dept_apollo_2', name: 'Pediatrics', description: 'Comprehensive Pediatric, Neonatal & Adolescent Care' },
    { _id: 'dept_apollo_3', name: 'Neurology', description: 'Neurosurgery, Stroke Unit & Comprehensive Neuro-Oncology' },
    { _id: 'dept_apollo_4', name: 'Orthopedics', description: 'Robotic Joint Replacement & Sports Arthroscopy' },
    { _id: 'dept_apollo_5', name: 'General Medicine', description: 'Internal Medicine, Diabetes & Lifestyle Disease Management' },
    { _id: 'dept_apollo_6', name: 'Dermatology', description: 'Medical, Surgical & Cosmetic Skin Care' },
  ],
  hosp_fortis: [
    { _id: 'dept_fortis_1', name: 'Cardiology', description: 'Directorate of Cardiac Sciences & Electrophysiology' },
    { _id: 'dept_fortis_2', name: 'Pediatrics', description: 'Pediatric Care, Immunization & Pediatric ICU' },
    { _id: 'dept_fortis_3', name: 'Oncology', description: 'Precision Medical, Surgical & Radiation Oncology' },
    { _id: 'dept_fortis_4', name: 'Gynecology', description: 'High Risk Obstetrics, Laparoscopy & Maternity' },
    { _id: 'dept_fortis_5', name: 'Gastroenterology', description: 'Hepatology, Advanced Endoscopy & Digestive Health' },
    { _id: 'dept_fortis_6', name: 'ENT', description: 'Otorhinolaryngology & Head-Neck Surgery' },
  ],
  hosp_max: [
    { _id: 'dept_max_1', name: 'Cardiology', description: 'Cardiovascular Surgery, Heart Failure & Angioplasty' },
    { _id: 'dept_max_2', name: 'Pediatrics', description: 'Pediatric Intensive Care & Child Health Services' },
    { _id: 'dept_max_3', name: 'Neurology', description: 'Comprehensive Stroke, Epilepsy & Movement Disorders' },
    { _id: 'dept_max_4', name: 'Dermatology', description: 'Laser Dermatology, Dermatosurgery & Hair Restoration' },
    { _id: 'dept_max_5', name: 'Orthopedics', description: 'Trauma Care, Sports Medicine & Joint Reconstruction' },
    { _id: 'dept_max_6', name: 'Endocrinology', description: 'Diabetes Institute & Hormonal Disorders' },
  ],
  hosp_manipal: [
    { _id: 'dept_manipal_1', name: 'Cardiology', description: 'Comprehensive Cardiac Care & Cardiac Rehabilitation' },
    { _id: 'dept_manipal_2', name: 'Pediatrics', description: 'Pediatric Pulmonology, Asthma & Child Wellness' },
    { _id: 'dept_manipal_3', name: 'Nephrology', description: 'Renal Transplant Center & 24x7 Dialysis Unit' },
    { _id: 'dept_manipal_4', name: 'Gynecology', description: 'Fertility Center, IVF & Reproductive Medicine' },
    { _id: 'dept_manipal_5', name: 'Psychiatry', description: 'Behavioral Sciences & Mental Health Wellness' },
    { _id: 'dept_manipal_6', name: 'General Surgery', description: 'Minimally Invasive Laparoscopic & Bariatric Surgery' },
  ],
  hosp_kokilaben: [
    { _id: 'dept_kokilaben_1', name: 'Cardiology', description: 'Centre for Cardiac Sciences & TAVR Program' },
    { _id: 'dept_kokilaben_2', name: 'Pediatrics', description: 'Centre for Child Health & Developmental Care' },
    { _id: 'dept_kokilaben_3', name: 'Neurology', description: 'Centre for Neurosciences & Minimally Invasive Spine' },
    { _id: 'dept_kokilaben_4', name: 'Dermatology', description: 'Centre for Aesthetic Dermatology & Cosmetology' },
    { _id: 'dept_kokilaben_5', name: 'Orthopedics', description: 'Centre for Bone & Joint Health, Arthroscopy' },
    { _id: 'dept_kokilaben_6', name: 'Ophthalmology', description: 'Centre for Vision, Blade-Free LASIK & Cornea' },
  ]
};

export const DEMO_REVIEWS = [
  {
    _id: 'rev_1',
    user: { name: 'Ramesh Sundaram' },
    rating: 5,
    comment: 'Exceptional treatment and utmost care by the doctors and hospital staff. Highly recommended!',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'rev_2',
    user: { name: 'Kavita Menon' },
    rating: 5,
    comment: 'Clean facilities, seamless booking through HealthCarePro, and top-class consultation.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    _id: 'rev_3',
    user: { name: 'Amitabh Sen' },
    rating: 4,
    comment: 'The doctors are experienced and gave clear diagnostic explanations. Very smooth experience.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

export const getHospitalDoctors = (hospitalQuery) => {
  if (!hospitalQuery) return DEMO_DOCTORS.slice(0, 6);
  const q = String(hospitalQuery).toLowerCase();
  const matched = DEMO_DOCTORS.filter(d => 
    d.hospital?._id?.toLowerCase() === q ||
    d.hospital?.name?.toLowerCase().includes(q) ||
    d.hospital?.slug?.toLowerCase().includes(q)
  );
  return matched.length > 0 ? matched : DEMO_DOCTORS.slice(0, 6);
};

export const getHospitalStats = (hospitalQuery) => {
  const docs = getHospitalDoctors(hospitalQuery);
  const hosp = DEMO_HOSPITALS.find(h => 
    h._id.toLowerCase() === String(hospitalQuery).toLowerCase() ||
    h.name.toLowerCase().includes(String(hospitalQuery).toLowerCase())
  ) || DEMO_HOSPITALS[0];

  return {
    hospitalName: hosp.name,
    status: 'approved',
    totalDoctors: docs.length,
    totalAppointments: 18,
    avgRating: hosp.rating || 4.9,
    appointmentsByStatus: {
      pending: 3,
      confirmed: 11,
      completed: 4
    }
  };
};

export const getHospitalAppointments = (hospitalQuery) => {
  const docs = getHospitalDoctors(hospitalQuery);
  const hospName = docs[0]?.hospital?.name || 'Main Multi-Specialty Hospital';
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      _id: 'apt_demo_1',
      patient: { name: 'Aarav Patel', email: 'aarav@gmail.com', phone: '+91 9820011223' },
      doctor: docs[0],
      doctorName: docs[0]?.user?.name,
      hospitalName: hospName,
      date: today,
      timeSlot: '10:00 AM',
      roomOrClinic: 'OPD Room 101',
      reason: 'Chest pain evaluation and ECG follow-up',
      status: 'confirmed',
      consultationFee: docs[0]?.consultationFee || 1200
    },
    {
      _id: 'apt_demo_2',
      patient: { name: 'Riya Sen', email: 'riya@gmail.com', phone: '+91 9820011224' },
      doctor: docs[1] || docs[0],
      doctorName: (docs[1] || docs[0])?.user?.name,
      hospitalName: hospName,
      date: today,
      timeSlot: '11:30 AM',
      roomOrClinic: 'Pediatric Suite 2',
      reason: 'Routine infant immunization and developmental check',
      status: 'confirmed',
      consultationFee: (docs[1] || docs[0])?.consultationFee || 800
    },
    {
      _id: 'apt_demo_3',
      patient: { name: 'Vikram Joshi', email: 'vikram.j@gmail.com', phone: '+91 9820011225' },
      doctor: docs[2] || docs[0],
      doctorName: (docs[2] || docs[0])?.user?.name,
      hospitalName: hospName,
      date: today,
      timeSlot: '02:30 PM',
      roomOrClinic: 'Consultation Room 3',
      reason: 'Chronic migraine and neurological review',
      status: 'pending',
      consultationFee: (docs[2] || docs[0])?.consultationFee || 1500
    }
  ];
};

export const generateDemoSlots = () => {
  const times = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];
  return times.map(t => ({
    time: t,
    isAvailable: true,
    day: 'Regular Clinic Shift',
    maxPatients: 15
  }));
};
