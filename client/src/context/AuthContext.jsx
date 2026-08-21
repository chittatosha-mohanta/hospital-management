import React, { createContext, useState } from 'react';
import api from '../services/api';
import { supabase } from '../services/supabase';

export const AuthContext = createContext();

// Mock profiles for instant 1-click Demo logins when offline/preview
const MOCK_DEMO_USERS = {
  'admin@healthcarepro.com': {
    _id: 'demo_superadmin',
    name: 'Platform Admin',
    email: 'admin@healthcarepro.com',
    role: 'superAdmin',
    token: 'demo_token_superadmin'
  },
  'rajesh@apollo.com': {
    _id: 'demo_admin_apollo',
    name: 'Rajesh Kumar',
    email: 'rajesh@apollo.com',
    role: 'hospitalAdmin',
    hospital: { _id: 'hosp_apollo', name: 'Apollo Multi-Specialty Hospital', slug: 'apollo-hospital', status: 'approved' },
    token: 'demo_token_rajesh'
  },
  'priya@fortis.com': {
    _id: 'demo_admin_fortis',
    name: 'Priya Sharma',
    email: 'priya@fortis.com',
    role: 'hospitalAdmin',
    hospital: { _id: 'hosp_fortis', name: 'Fortis Memorial Research Institute', slug: 'fortis-memorial', status: 'approved' },
    token: 'demo_token_priya'
  },
  'sanjay@max.com': {
    _id: 'demo_admin_max',
    name: 'Sanjay Dutt',
    email: 'sanjay@max.com',
    role: 'hospitalAdmin',
    hospital: { _id: 'hosp_max', name: 'Max Super Speciality Hospital', slug: 'max-hospital', status: 'approved' },
    token: 'demo_token_sanjay'
  },
  'deepak@manipal.com': {
    _id: 'demo_admin_manipal',
    name: 'Deepak Chopra',
    email: 'deepak@manipal.com',
    role: 'hospitalAdmin',
    hospital: { _id: 'hosp_manipal', name: 'Manipal Hospital', slug: 'manipal-hospital', status: 'approved' },
    token: 'demo_token_deepak'
  },
  'anil@kokilaben.com': {
    _id: 'demo_admin_kokilaben',
    name: 'Anil Kapoor',
    email: 'anil@kokilaben.com',
    role: 'hospitalAdmin',
    hospital: { _id: 'hosp_kokilaben', name: 'Kokilaben Dhirubhai Ambani Hospital', slug: 'kokilaben-hospital', status: 'approved' },
    token: 'demo_token_anil'
  },
  'ananya@apollo.com': {
    _id: 'demo_doc_ananya',
    name: 'Dr. Ananya Verma',
    email: 'ananya@apollo.com',
    role: 'doctor',
    hospital: { _id: 'hosp_apollo', name: 'Apollo Multi-Specialty Hospital' },
    doctorProfile: { specialization: 'Cardiology', qualification: 'MBBS, MD' },
    token: 'demo_token_ananya'
  },
  'arjun@apollo.com': {
    _id: 'demo_doc_arjun',
    name: 'Dr. Arjun Reddy',
    email: 'arjun@apollo.com',
    role: 'doctor',
    hospital: { _id: 'hosp_apollo', name: 'Apollo Multi-Specialty Hospital' },
    doctorProfile: { specialization: 'Pediatrics', qualification: 'MBBS, MD' },
    token: 'demo_token_arjun'
  },
  'rahul@fortis.com': {
    _id: 'demo_doc_rahul',
    name: 'Dr. Rahul Joshi',
    email: 'rahul@fortis.com',
    role: 'doctor',
    hospital: { _id: 'hosp_fortis', name: 'Fortis Memorial Research Institute' },
    doctorProfile: { specialization: 'Cardiology', qualification: 'MBBS, MD' },
    token: 'demo_token_rahul'
  },
  'sonia@fortis.com': {
    _id: 'demo_doc_sonia',
    name: 'Dr. Sonia Gupta',
    email: 'sonia@fortis.com',
    role: 'doctor',
    hospital: { _id: 'hosp_fortis', name: 'Fortis Memorial Research Institute' },
    doctorProfile: { specialization: 'Pediatrics', qualification: 'MBBS, MD' },
    token: 'demo_token_sonia'
  },
  'sanjaydutt@max.com': {
    _id: 'demo_doc_sanjaydutt',
    name: 'Dr. Sanjay Dutt',
    email: 'sanjaydutt@max.com',
    role: 'doctor',
    hospital: { _id: 'hosp_max', name: 'Max Super Speciality Hospital' },
    doctorProfile: { specialization: 'Cardiology', qualification: 'MBBS, MD' },
    token: 'demo_token_sanjaydutt'
  },
  'karan@max.com': {
    _id: 'demo_doc_karan',
    name: 'Dr. Karan Johar',
    email: 'karan@max.com',
    role: 'doctor',
    hospital: { _id: 'hosp_max', name: 'Max Super Speciality Hospital' },
    doctorProfile: { specialization: 'Pediatrics', qualification: 'MBBS, MD' },
    token: 'demo_token_karan'
  },
  'chopra@manipal.com': {
    _id: 'demo_doc_chopra',
    name: 'Dr. Deepak Chopra',
    email: 'chopra@manipal.com',
    role: 'doctor',
    hospital: { _id: 'hosp_manipal', name: 'Manipal Hospital' },
    doctorProfile: { specialization: 'Cardiology', qualification: 'MBBS, MD' },
    token: 'demo_token_chopra'
  },
  'divya@manipal.com': {
    _id: 'demo_doc_divya',
    name: 'Dr. Divya Spandana',
    email: 'divya@manipal.com',
    role: 'doctor',
    hospital: { _id: 'hosp_manipal', name: 'Manipal Hospital' },
    doctorProfile: { specialization: 'Pediatrics', qualification: 'MBBS, MD' },
    token: 'demo_token_divya'
  },
  'anilkapoor@kokilaben.com': {
    _id: 'demo_doc_anilkapoor',
    name: 'Dr. Anil Kapoor',
    email: 'anilkapoor@kokilaben.com',
    role: 'doctor',
    hospital: { _id: 'hosp_kokilaben', name: 'Kokilaben Dhirubhai Ambani Hospital' },
    doctorProfile: { specialization: 'Cardiology', qualification: 'MBBS, MD' },
    token: 'demo_token_anilkapoor'
  },
  'madhuri@kokilaben.com': {
    _id: 'demo_doc_madhuri',
    name: 'Dr. Madhuri Dixit',
    email: 'madhuri@kokilaben.com',
    role: 'doctor',
    hospital: { _id: 'hosp_kokilaben', name: 'Kokilaben Dhirubhai Ambani Hospital' },
    doctorProfile: { specialization: 'Pediatrics', qualification: 'MBBS, MD' },
    token: 'demo_token_madhuri'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [loading, setLoading] = useState(false);

  const getDemoUser = (email) => {
    const cleanEmail = email.toLowerCase().trim();
    if (MOCK_DEMO_USERS[cleanEmail]) {
      return MOCK_DEMO_USERS[cleanEmail];
    }
    if (cleanEmail.startsWith('patient') && cleanEmail.endsWith('@gmail.com')) {
      const num = cleanEmail.replace('patient', '').replace('@gmail.com', '') || '1';
      return {
        _id: `demo_patient_${num}`,
        name: `Patient User ${num}`,
        email: cleanEmail,
        role: 'patient',
        token: `demo_token_patient_${num}`
      };
    }
    return null;
  };

  const login = async (email, password) => {
    const demoFallback = getDemoUser(email);

    try {
      if (!supabase) {
        // Direct backend authentication
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
      }

      // 1. Log in via Supabase
      const { error: sbError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (sbError) {
        // If Supabase failed (e.g. user not yet in Supabase Auth or network unreachable), try fallback to backend or demo profile
        if (demoFallback) {
          setUser(demoFallback);
          localStorage.setItem('userInfo', JSON.stringify(demoFallback));
          return demoFallback;
        }
        throw new Error(sbError.message);
      }

      // 2. Fetch/sync Mongo user profile and token
      try {
        const { data } = await api.post('/auth/supabase-login', { email });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
      } catch {
        if (demoFallback) {
          setUser(demoFallback);
          localStorage.setItem('userInfo', JSON.stringify(demoFallback));
          return demoFallback;
        }
        throw new Error('Supabase sign-in succeeded, but backend server is unreachable.');
      }
    } catch (err) {
      // Network Error / Failed to fetch fallback for demo users
      const isNetworkError = err.message?.includes('fetch') || 
                             err.message?.includes('Network Error') || 
                             err.code === 'ERR_NETWORK';

      if (demoFallback && (isNetworkError || !err.response)) {
        setUser(demoFallback);
        localStorage.setItem('userInfo', JSON.stringify(demoFallback));
        return demoFallback;
      }

      if (isNetworkError) {
        throw new Error('Backend server is currently offline or unreachable. Please deploy the server or check VITE_API_URL.', { cause: err });
      }
      throw err;
    }
  };

  const registerPatient = async (userData) => {
    if (!supabase) {
      // Fallback to local MongoDB registration
      const { data } = await api.post('/auth/register', userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    }
    // 1. Register user via Supabase
    const { error: sbError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    if (sbError) throw new Error(sbError.message);

    // 2. Sync profile fields to MongoDB
    try {
      const { data } = await api.post('/auth/register', userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (syncErr) {
      console.warn('Backend profile sync issue:', syncErr);
      const patientUser = {
        name: userData.name,
        email: userData.email,
        role: 'patient',
        token: 'supabase_registered_token'
      };
      setUser(patientUser);
      localStorage.setItem('userInfo', JSON.stringify(patientUser));
      return patientUser;
    }
  };

  const registerHospital = async (hospitalData) => {
    if (!supabase) {
      // Fallback to local MongoDB registration
      const { data } = await api.post('/auth/register-hospital', hospitalData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    }
    // 1. Register hospital admin via Supabase
    const { error: sbError } = await supabase.auth.signUp({
      email: hospitalData.adminEmail,
      password: hospitalData.adminPassword,
    });
    if (sbError) throw new Error(sbError.message);

    // 2. Sync hospital + admin details to MongoDB
    try {
      const { data } = await api.post('/auth/register-hospital', hospitalData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (syncErr) {
      console.warn('Backend hospital sync issue:', syncErr);
      const hospitalUser = {
        name: hospitalData.adminName,
        email: hospitalData.adminEmail,
        role: 'hospitalAdmin',
        hospital: { name: hospitalData.hospitalName, status: 'pending' },
        token: 'supabase_registered_token'
      };
      setUser(hospitalUser);
      localStorage.setItem('userInfo', JSON.stringify(hospitalUser));
      return hospitalUser;
    }
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn(err);
      }
    }
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('userInfo', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      registerPatient,
      registerHospital,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

