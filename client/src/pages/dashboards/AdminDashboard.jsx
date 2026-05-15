import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Users, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });

  const chartData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 19 },
    { name: 'Wed', appointments: 15 },
    { name: 'Thu', appointments: 22 },
    { name: 'Fri', appointments: 30 },
    { name: 'Sat', appointments: 10 },
    { name: 'Sun', appointments: 5 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'bg-purple-500' },
    { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Pending', value: stats.pendingAppointments, icon: Clock, color: 'bg-red-500' },
    { label: 'Completed', value: stats.completedAppointments, icon: CheckCircle, color: 'bg-emerald-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
          >
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-${card.color.split('-')[1]}-500/30`}>
              <card.icon className="text-white w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Appointment Trends</h3>
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full text-sm font-bold">
              <TrendingUp className="w-4 h-4" /> +12.5%
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Announcements */}
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Announcements</h3>
          <div className="space-y-6">
            {[
              { title: 'New Cardiology Head', time: '2h ago', color: 'bg-blue-500' },
              { title: 'Vaccination Drive', time: '5h ago', color: 'bg-orange-500' },
              { title: 'System Maintenance', time: '1d ago', color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full ${item.color} mt-2`}></div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold transition-all">
            View All
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
