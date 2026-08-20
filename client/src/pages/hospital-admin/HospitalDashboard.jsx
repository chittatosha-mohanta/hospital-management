import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Layers,
  Bed,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const HospitalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHospitalStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/hospitals/my-hospital/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center text-slate-400">Loading hospital metrics...</div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: 'Active Doctors', value: stats?.totalDoctors || 0, icon: Users, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: Calendar, color: 'from-cyan-500 to-cyan-600', shadow: 'shadow-cyan-500/20' },
    { label: 'Pending Bookings', value: stats?.appointmentsByStatus?.pending || 0, icon: Clock, color: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/20' },
    { label: 'Average Rating', value: `${stats?.avgRating || 5.0} ★`, icon: Star, color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              stats?.status === 'approved' 
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
            }`}>
              Status: {stats?.status || 'Pending Approval'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats?.hospitalName || 'Hospital Dashboard'}
          </h1>
          <p className="text-slate-500 text-sm">Manage medical staff, departments, and monitor daily patient appointments.</p>
        </div>

        <Link
          to="/hospital-admin/doctors"
          className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/30 flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Doctor
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center mb-4 shadow-lg ${card.shadow}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/hospital-admin/doctors"
          className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Doctor Management</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Add doctors, assign specializations, set consultation fees, and configure weekly time slots.
          </p>
          <span className="text-xs font-bold text-primary-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Manage Roster &rarr;
          </span>
        </Link>

        <Link
          to="/hospital-admin/departments"
          className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hospital Departments</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Create clinical departments (Cardiology, Oncology, ICU) and assign department heads.
          </p>
          <span className="text-xs font-bold text-primary-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Departments &rarr;
          </span>
        </Link>

        <Link
          to="/hospital-admin/appointments"
          className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hospital Bookings</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Track daily appointments across all doctors, confirm schedules, and view patient check-ins.
          </p>
          <span className="text-xs font-bold text-primary-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Appointments &rarr;
          </span>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
