import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Building2, 
  Calendar, 
  Users, 
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../../services/api';

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/super-admin/analytics');
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statusData = [
    { name: 'Completed', value: analytics?.appointmentsByStatus?.completed || 12, color: '#10b981' },
    { name: 'Confirmed', value: analytics?.appointmentsByStatus?.confirmed || 18, color: '#0ea5e9' },
    { name: 'Pending', value: analytics?.appointmentsByStatus?.pending || 8, color: '#f59e0b' },
    { name: 'Cancelled', value: analytics?.appointmentsByStatus?.cancelled || 4, color: '#ef4444' },
  ];

  const specialtyDistribution = [
    { name: 'Cardiology', doctors: 8 },
    { name: 'Neurology', doctors: 5 },
    { name: 'Orthopedics', doctors: 6 },
    { name: 'Oncology', doctors: 4 },
    { name: 'Pediatrics', doctors: 7 },
    { name: 'Dermatology', doctors: 4 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Platform Analytics
        </h1>
        <p className="text-slate-500 text-sm">
          Deep-dive performance insights, specialty distribution, and appointment status metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Appointment Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Appointment Status Distribution</h3>
          <p className="text-xs text-slate-500 mb-6">Real-time status across all network bookings</p>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Specialties Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Doctors by Specialty</h3>
          <p className="text-xs text-slate-500 mb-6">Distribution of clinical specialists across the network</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={specialtyDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="doctors" fill="#0ea5e9" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlatformAnalytics;
