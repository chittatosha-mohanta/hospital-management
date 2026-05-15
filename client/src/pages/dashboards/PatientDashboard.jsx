import DashboardLayout from '../../layouts/DashboardLayout';
import { Search, Calendar, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Patient Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your health records and appointments.</p>
        </div>
        <Link to="/patient/search" className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all">
          <Plus className="w-5 h-5" /> Book Appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/20">
              <Calendar className="w-10 h-10 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">My Appointments</h3>
              <p className="text-primary-100 mb-4 text-sm">View and manage your upcoming visits.</p>
              <Link to="/patient/appointments" className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-all">
                View All
              </Link>
            </div>
            <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <FileText className="w-10 h-10 mb-4 text-primary-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Medical Reports</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Access your prescriptions and test results.</p>
              <Link to="/patient/history" className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-bold transition-all">
                Browse Files
              </Link>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Appointments</h3>
            </div>
            <div className="p-8">
              <p className="text-center py-10 text-slate-500 dark:text-slate-400">No recent activity found.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="text-primary-500 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Health Tip</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm italic">
              "Stay hydrated! Drinking enough water is essential for your overall health and well-being."
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
