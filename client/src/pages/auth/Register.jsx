import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Activity, Mail, Lock, User, ArrowRight, Loader2, Phone, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    bloodGroup: 'O+',
  });
  const [loading, setLoading] = useState(false);
  const { registerPatient } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await registerPatient(formData);
      
      // Auto-confirm pending booking if patient came from booking flow
      const pendingBookingStr = sessionStorage.getItem('pendingBooking');
      if (pendingBookingStr) {
        try {
          const pendingBooking = JSON.parse(pendingBookingStr);
          await api.post('/appointments', pendingBooking);
          sessionStorage.removeItem('pendingBooking');
          toast.success('🎉 Welcome to HealthCarePro! Your appointment has been booked!');
          navigate('/patient/appointments');
          return;
        } catch (bookingErr) {
          console.error(bookingErr);
        }
      }

      toast.success(`Welcome to HealthCarePro, ${user.name}!`);
      navigate('/patient');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 sm:p-12 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
              <Activity className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Create Patient Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Join the national hospital network for easy online bookings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm dark:text-white"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm dark:text-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm dark:text-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-sm dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-sm dark:text-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Create Patient Account <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Already have an account? <Link to="/login" className="text-primary-500 font-bold hover:underline">Log in</Link>
            </p>
            <div className="p-3 bg-primary-500/10 rounded-2xl border border-primary-500/20 text-primary-600 dark:text-primary-400 font-medium flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Are you a hospital representative?</span>
              <Link to="/register-hospital" className="font-bold underline">Register Hospital</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
