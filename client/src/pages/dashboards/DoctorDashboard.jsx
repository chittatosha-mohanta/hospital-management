import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Calendar, 
  Users, 
  ClipboardList, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Activity,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [aptRes, profRes] = await Promise.all([
        api.get('/appointments/doctor'),
        api.get('/doctors/profile/me').catch(() => ({ data: null })),
      ]);
      setAppointments(aptRes.data.appointments || []);
      setDoctorProfile(profRes.data);
    } catch (err) {
      console.error('Error fetching doctor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => {
    const aptDate = new Date(a.date).toISOString().split('T')[0];
    return aptDate === todayStr;
  });

  const confirmedApts = appointments.filter((a) => a.status === 'confirmed');
  const completedApts = appointments.filter((a) => a.status === 'completed');

  // Breakdown of bookings by hospital today
  const hospitalBookingsMap = {};
  todayAppointments.forEach((a) => {
    const hosp = a.hospitalName || a.hospital?.name || 'Main Hospital';
    hospitalBookingsMap[hosp] = (hospitalBookingsMap[hosp] || 0) + 1;
  });

  const hospitalBookingsList = Object.entries(hospitalBookingsMap);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 inline-flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5" /> Doctor Practice Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Welcome, Dr. {user?.name || 'Doctor'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Here is your live multi-hospital patient schedule and consultation overview.
          </p>
        </div>

        <Link
          to="/doctor/schedule"
          className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm hover:border-primary-500 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Clock className="w-4 h-4 text-primary-500" /> Manage Shifts & Locations
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Today's Bookings",
            value: todayAppointments.length,
            desc: "Appointments scheduled today",
            icon: Calendar,
            color: "bg-blue-500",
          },
          {
            label: "Active / Confirmed",
            value: confirmedApts.length,
            desc: "Ready for consultation",
            icon: CheckCircle2,
            color: "bg-emerald-500",
          },
          {
            label: "Consultations Completed",
            value: completedApts.length,
            desc: "Prescriptions issued",
            icon: ClipboardList,
            color: "bg-purple-500",
          },
          {
            label: "Total Patient Visits",
            value: appointments.length,
            desc: "All-time bookings across hospitals",
            icon: Users,
            color: "bg-amber-500",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="p-7 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden"
          >
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{loading ? '...' : card.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Today's Hospital-wise Schedule Breakdown */}
      {hospitalBookingsList.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent rounded-[2.5rem] border border-primary-500/20">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary-500" /> Today's Patients by Practicing Hospital:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hospitalBookingsList.map(([hospName, count], idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">🏥 {hospName}</p>
                  <p className="text-[11px] text-slate-400">Scheduled for today</p>
                </div>
                <span className="px-3 py-1 bg-primary-500 text-white rounded-full font-black text-xs">
                  {count} {count === 1 ? 'Patient' : 'Patients'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent & Upcoming Appointments</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live patient queue across all practicing locations</p>
          </div>
          <Link
            to="/doctor/appointments"
            className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            View All ({appointments.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-4 sm:p-8">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading appointment queue...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-base text-slate-800 dark:text-slate-200">No Patient Appointments Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Once patients book consultation slots through the platform, their details and hospital location will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 6).map((apt) => (
                <div
                  key={apt._id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-500/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-base shrink-0">
                      {apt.patient?.name ? apt.patient.name.charAt(0) : 'P'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{apt.patient?.name || 'Patient'}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                          apt.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600' :
                          apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                        <strong className="text-slate-800 dark:text-slate-200">{apt.hospitalName || apt.hospital?.name}</strong>
                        {apt.roomOrClinic && <span className="font-mono text-primary-500 font-semibold">({apt.roomOrClinic})</span>}
                        <span>&bull; {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/doctor/appointments"
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all self-start sm:self-auto text-center"
                  >
                    Manage Visit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
