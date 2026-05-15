import DashboardLayout from '../../layouts/DashboardLayout';
import { Calendar, Users, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Doctor Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your appointments and patient records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Today's Bookings", value: "8", icon: Calendar, color: "bg-blue-500" },
          { label: "Total Patients", value: "124", icon: Users, color: "bg-purple-500" },
          { label: "Pending Reports", value: "3", icon: ClipboardList, color: "bg-orange-500" },
        ].map((card, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon className="text-white w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Appointments</h3>
        </div>
        <div className="p-8">
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            No appointments for today.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
