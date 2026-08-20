import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';

const SuperAdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, hospitalsRes] = await Promise.all([
        api.get('/super-admin/analytics'),
        api.get('/super-admin/hospitals?status=pending'),
      ]);

      setAnalytics(analyticsRes.data);
      setPendingHospitals(hospitalsRes.data.hospitals || []);
    } catch (err) {
      console.error('Error loading super admin dashboard:', err);
      toast.error('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveHospital = async (hospitalId) => {
    try {
      await api.put(`/super-admin/hospitals/${hospitalId}/status`, { status: 'approved' });
      toast.success('Hospital approved successfully!');
      fetchDashboardData();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleRejectHospital = async (hospitalId) => {
    const reason = prompt('Please provide a reason for rejecting this hospital:');
    if (!reason) return;

    try {
      await api.put(`/super-admin/hospitals/${hospitalId}/status`, {
        status: 'rejected',
        rejectionReason: reason,
      });
      toast.info('Hospital application rejected');
      fetchDashboardData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const chartData = [
    { name: 'Mon', bookings: 24, hospitals: 2 },
    { name: 'Tue', bookings: 38, hospitals: 2 },
    { name: 'Wed', bookings: 45, hospitals: 3 },
    { name: 'Thu', bookings: 52, hospitals: 3 },
    { name: 'Fri', bookings: 68, hospitals: 3 },
    { name: 'Sat', bookings: 42, hospitals: 3 },
    { name: 'Sun', bookings: 29, hospitals: 3 },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const overview = analytics?.overview || {};

  const statCards = [
    { label: 'Total Hospitals', value: overview.totalHospitals || 0, icon: Building2, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Pending Approvals', value: overview.pendingHospitals || 0, icon: Clock, color: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/20' },
    { label: 'Total Doctors', value: overview.totalDoctors || 0, icon: Users, color: 'from-cyan-500 to-cyan-600', shadow: 'shadow-cyan-500/20' },
    { label: 'Total Patients', value: overview.totalPatients || 0, icon: Users, color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
    { label: 'Total Appointments', value: overview.totalAppointments || 0, icon: Calendar, color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
          Super Admin Console
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
          Platform Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Real-time metrics, hospital verification requests, and network health.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
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

      {/* Pending Approvals Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> Pending Hospital Approvals ({pendingHospitals.length})
            </h2>
            <p className="text-xs text-slate-500">Hospitals waiting for platform verification before going live</p>
          </div>

          <Link to="/super-admin/hospitals" className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-1">
            View All Hospitals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingHospitals.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-3xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All Clear!</p>
            <p className="text-xs text-slate-400">No hospitals currently pending verification.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingHospitals.map((hosp) => (
              <div
                key={hosp._id}
                className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{hosp.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      Pending Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Location: {hosp.address?.city}, {hosp.address?.state} &bull; Admin: {hosp.registeredBy?.name || hosp.email}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleApproveHospital(hosp._id)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectHospital(hosp._id)}
                    className="px-4 py-2.5 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Chart & Top Hospitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Platform Appointment Volume</h3>
              <p className="text-xs text-slate-500">Weekly trend across all hospitals</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +24% this week
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="bookColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="bookings" stroke="#0ea5e9" strokeWidth={3} fill="url(#bookColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hospitals */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Top Hospitals</h3>
          <p className="text-xs text-slate-500 mb-6">Highest rated in the network</p>

          <div className="space-y-4">
            {analytics?.topHospitals?.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{h.name}</h4>
                    <p className="text-[10px] text-slate-400">{h.address?.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {h.avgRating || 5.0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
