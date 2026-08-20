import React, { createContext, useState } from 'react';
import api from '../services/api';
import { supabase } from '../services/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    // 1. Log in via Supabase
    const { error: sbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (sbError) throw new Error(sbError.message);

    // 2. Fetch/sync Mongo user profile and token
    const { data } = await api.post('/auth/supabase-login', { email });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const registerPatient = async (userData) => {
    // 1. Register user via Supabase
    const { error: sbError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    if (sbError) throw new Error(sbError.message);

    // 2. Sync profile fields to MongoDB
    const { data } = await api.post('/auth/register', userData);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const registerHospital = async (hospitalData) => {
    // 1. Register hospital admin via Supabase
    const { error: sbError } = await supabase.auth.signUp({
      email: hospitalData.adminEmail,
      password: hospitalData.adminPassword,
    });
    if (sbError) throw new Error(sbError.message);

    // 2. Sync hospital + admin details to MongoDB
    const { data } = await api.post('/auth/register-hospital', hospitalData);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
