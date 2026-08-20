import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Calendar, 
  FileText, 
  Plus, 
  Search, 
  Building2, 
  Activity, 
  Clock, 
  User, 
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [aptRes, rxRes] = await Promise.all([
        api.get('/appointments/my?limit=5'),
        api.get('/prescriptions?limit=3'),
      ]);
      setAppointments(aptRes.data.appointments || []);
      setPrescriptions(rxRes.data.prescriptions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Patient Health Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Welcome, {user?.name || 'Patient'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your hospital visits, medical history, and verified doctor appointments.
          </p>
        </div>

        <Link 
          to="/doctors" 
          className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/30 flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </Link>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/25 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-1">My Bookings</h3>
            <p className="text-primary-100 text-xs leading-relaxed mb-6">
              You have <strong className="text-white">{upcomingAppointments.length} upcoming</strong> hospital appointments.
            </p>
          </div>
          <Link
            to="/patient/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-primary-600 px-4 py-2.5 rounded-xl self-start hover:bg-primary-50 transition-colors shadow-md"
          >
            View Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Medical Records</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Access digital prescriptions and physician diagnoses from all completed visits.
            </p>
          </div>
          <Link
            to="/patient/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-500 hover:underline self-start"
          >
            Access Records <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Partner Hospitals</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Explore verified healthcare networks with 24/7 emergency care and specialized clinics.
            </p>
          </div>
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-500 hover:underline self-start"
          >
            Explore Hospitals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent / Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" /> Recent Bookings
            </h2>
            <Link to="/patient/appointments" className="text-xs font-bold text-primary-500 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading your visits...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No Appointments Yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Book your first consultation with any partner hospital.</p>
              <Link
                to="/doctors"
                className="px-5 py-2 bg-primary-500 text-white rounded-xl text-xs font-bold inline-block shadow-md shadow-primary-500/20"
              >
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-sm shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Dr. {apt.doctor?.name || 'Specialist'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        <strong className="text-slate-800 dark:text-slate-200">🏥 {apt.hospitalName || apt.hospital?.name}</strong> {apt.roomOrClinic ? `(${apt.roomOrClinic})` : ''} &bull; <span className="font-semibold text-primary-500">{new Date(apt.date).toLocaleDateString()}</span> at {apt.timeSlot}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto ${
                    apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                    apt.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600' :
                    apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patient Profile Card & Health Tip */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-7">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Patient Profile</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b dark:border-slate-800">
                <span className="text-slate-400">Full Name</span>
                <span className="font-bold dark:text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-slate-800">
                <span className="text-slate-400">Email</span>
                <span className="font-bold dark:text-white">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex justify-between py-2 border-b dark:border-slate-800">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-bold dark:text-white">{user.phone}</span>
                </div>
              )}
              {user?.bloodGroup && (
                <div className="flex justify-between py-2 border-b dark:border-slate-800">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="font-bold text-red-500">{user.bloodGroup}</span>
                </div>
              )}
              {user?.gender && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Gender</span>
                  <span className="font-bold capitalize dark:text-white">{user.gender}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-7 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-primary-400" />
              <h4 className="font-bold text-sm">Health Tip of the Day</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Stay well-hydrated and maintain a 30-minute daily walking routine to improve cardiovascular endurance and immunity."
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
