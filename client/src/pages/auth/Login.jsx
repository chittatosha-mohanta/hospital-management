import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, Loader2, Sparkles, Shield, Building2, Stethoscope, UserCheck, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const DEMO_ACCOUNTS = [
  {
    role: 'Super Admin',
    name: 'Platform Admin',
    email: 'admin@healthcarepro.com',
    password: 'admin123',
    icon: Shield,
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    desc: 'System oversight, hospital approvals & analytics'
  },
  {
    role: 'Hospital Admin',
    name: 'Apollo Hospital (Rajesh)',
    email: 'rajesh@apollo.com',
    password: 'hospital123',
    icon: Building2,
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    desc: 'Hospital operations, doctors & department setup'
  },
  {
    role: 'Doctor',
    name: 'Dr. Ananya (Cardiology)',
    email: 'ananya@apollo.com',
    password: 'doctor123',
    icon: Stethoscope,
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    desc: 'Manage appointments, prescriptions & shifts'
  },
  {
    role: 'Patient',
    name: 'Patient User 1',
    email: 'patient1@gmail.com',
    password: 'patient123',
    icon: UserCheck,
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    desc: 'Book slots, find hospitals & view history'
  }
];

const ALL_DEMO_USERS = [
  { role: 'Hospital Admin', name: 'Priya Sharma (Fortis)', email: 'priya@fortis.com', password: 'hospital123' },
  { role: 'Hospital Admin', name: 'Sanjay Dutt (Max)', email: 'sanjay@max.com', password: 'hospital123' },
  { role: 'Hospital Admin', name: 'Deepak Chopra (Manipal)', email: 'deepak@manipal.com', password: 'hospital123' },
  { role: 'Hospital Admin', name: 'Anil Kapoor (Kokilaben)', email: 'anil@kokilaben.com', password: 'hospital123' },
  { role: 'Doctor', name: 'Dr. Arjun Reddy (Pediatrics - Apollo)', email: 'arjun@apollo.com', password: 'doctor123' },
  { role: 'Doctor', name: 'Dr. Rahul Joshi (Cardiology - Fortis)', email: 'rahul@fortis.com', password: 'doctor123' },
  { role: 'Doctor', name: 'Dr. Sonia Gupta (Pediatrics - Fortis)', email: 'sonia@fortis.com', password: 'doctor123' },
  { role: 'Doctor', name: 'Dr. Sanjay Dutt (Cardiology - Max)', email: 'sanjaydutt@max.com', password: 'doctor123' },
  { role: 'Doctor', name: 'Dr. Karan Johar (Pediatrics - Max)', email: 'karan@max.com', password: 'doctor123' },
  { role: 'Doctor', name: 'Dr. Divya Spandana (Pediatrics - Manipal)', email: 'divya@manipal.com', password: 'doctor123' },
  { role: 'Doctor', name: 'Dr. Anil Kapoor (Cardiology - Kokilaben)', email: 'anilkapoor@kokilaben.com', password: 'doctor123' },
  { role: 'Doctor', name: 'Dr. Madhuri Dixit (Pediatrics - Kokilaben)', email: 'madhuri@kokilaben.com', password: 'doctor123' },
  { role: 'Patient', name: 'Patient User 2', email: 'patient2@gmail.com', password: 'patient123' },
  { role: 'Patient', name: 'Patient User 3', email: 'patient3@gmail.com', password: 'patient123' },
  { role: 'Patient', name: 'Patient User 4', email: 'patient4@gmail.com', password: 'patient123' },
  { role: 'Patient', name: 'Patient User 5', email: 'patient5@gmail.com', password: 'patient123' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMoreDemo, setShowMoreDemo] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginWithCredentials = async (loginEmail, loginPassword) => {
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPassword);
      // Handle pending booking if any
      const pendingBookingStr = sessionStorage.getItem('pendingBooking');
      if (user.role === 'patient' && pendingBookingStr) {
        try {
          const pendingBooking = JSON.parse(pendingBookingStr);
          await api.post('/appointments', pendingBooking);
          sessionStorage.removeItem('pendingBooking');
          toast.success('🎉 Appointment confirmed and booked!');
          navigate('/patient/appointments');
          return;
        } catch (bookingErr) {
          console.error(bookingErr);
        }
      }

      // Redirect based on role
      if (user.role === 'superAdmin') navigate('/super-admin');
      else if (user.role === 'hospitalAdmin') navigate('/hospital-admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginWithCredentials(email, password);
  };

  const fillAndLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLoginWithCredentials(demoEmail, demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
              <Activity className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Enter credentials or click any demo account below for instant entry
            </p>
          </div>

          {/* ⚡ 1-Click Demo Login Panel */}
          <div className="mb-8 p-5 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Instant Demo Access (1-Click Login)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Auto-fills & logs in</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((acc, index) => {
                const IconComponent = acc.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={loading}
                    onClick={() => fillAndLogin(acc.email, acc.password)}
                    className="flex items-start gap-3 p-3 text-left rounded-2xl bg-white dark:bg-slate-850 hover:bg-primary-50/80 dark:hover:bg-primary-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-primary-300 dark:hover:border-primary-700 transition-all shadow-sm hover:shadow group disabled:opacity-50"
                  >
                    <div className={`p-2 rounded-xl border ${acc.badgeColor} mt-0.5 group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {acc.role}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                        {acc.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expand for more demo accounts */}
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setShowMoreDemo(!showMoreDemo)}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
              >
                <span>{showMoreDemo ? 'Hide additional demo accounts' : 'View more demo logins (Fortis, Max, Manipal, etc.)'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreDemo ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showMoreDemo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 space-y-1.5"
                  >
                    {ALL_DEMO_USERS.map((user, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={loading}
                        onClick={() => fillAndLogin(user.email, user.password)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/70 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-left text-xs transition-all"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                          <span className="text-[10px] ml-2 text-slate-400 font-mono">({user.email})</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          {user.role}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-primary-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account? <Link to="/register" className="text-primary-500 font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

