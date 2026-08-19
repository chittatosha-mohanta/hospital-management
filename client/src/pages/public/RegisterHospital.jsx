import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/home/Navbar';
import Footer from '../../components/home/Footer';
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Bed, 
  Ambulance, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterHospital = () => {
  const { registerHospital } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Admin user details
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
    // Hospital details
    hospitalName: '',
    hospitalEmail: '',
    hospitalPhone: '',
    description: '',
    website: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    bedCount: 100,
    emergencyServices: true,
    ambulanceService: true,
    specialties: 'Cardiology, Neurology, Orthopedics, Pediatrics',
    facilities: 'ICU, Emergency, Pharmacy, Lab, Radiology',
    openTime: '08:00',
    closeTime: '20:00',
    is24x7: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        adminPhone: formData.adminPhone,
        hospitalName: formData.hospitalName,
        hospitalEmail: formData.hospitalEmail,
        hospitalPhone: formData.hospitalPhone,
        description: formData.description,
        website: formData.website,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        },
        bedCount: Number(formData.bedCount),
        emergencyServices: formData.emergencyServices,
        ambulanceService: formData.ambulanceService,
        specialties: formData.specialties.split(',').map((s) => s.trim()).filter(Boolean),
        facilities: formData.facilities.split(',').map((f) => f.trim()).filter(Boolean),
        operatingHours: {
          open: formData.openTime,
          close: formData.closeTime,
          is24x7: formData.is24x7,
        },
      };

      await registerHospital(payload);
      toast.success('🎉 Hospital registered successfully! Awaiting Platform Admin approval.');
      navigate('/hospital-admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />

      <section className="pt-32 pb-24 px-6 max-w-4xl mx-auto w-full flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-14 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none"
        >
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20 shadow-lg shadow-primary-500/10">
              <Building2 className="w-8 h-8" />
            </div>
            <span className="px-3.5 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-xs font-bold uppercase tracking-wider">
              Partner Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2 mb-3">
              Register Your Hospital
            </h1>
            <p className="text-slate-500 text-sm">
              Join India's interconnected healthcare platform. Manage your doctors, accept online appointments, and reach thousands of patients.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Hospital Details */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-500" /> Hospital Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hospital Name *</label>
                  <input
                    type="text"
                    required
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    placeholder="e.g. City Care Multi-Specialty Hospital"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hospital Email *</label>
                  <input
                    type="email"
                    required
                    name="hospitalEmail"
                    value={formData.hospitalEmail}
                    onChange={handleChange}
                    placeholder="info@hospital.com"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hospital Phone *</label>
                  <input
                    type="tel"
                    required
                    name="hospitalPhone"
                    value={formData.hospitalPhone}
                    onChange={handleChange}
                    placeholder="+91 44 2829 3333"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">About the Hospital</label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide an overview of your healthcare facility..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Address & Location */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" /> Location Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Street Address *</label>
                  <input
                    type="text"
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. 21 Greams Lane, Off Greams Road"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Chennai"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pincode *</label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="600006"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Total Bed Capacity</label>
                  <input
                    type="number"
                    name="bedCount"
                    value={formData.bedCount}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Facilities & Specialties */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-500" /> Facilities & Specialties
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Specialties (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleChange}
                    placeholder="Cardiology, Neurology, Orthopedics..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Facilities (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="facilities"
                    value={formData.facilities}
                    onChange={handleChange}
                    placeholder="ICU, Emergency, Pharmacy, Lab..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer dark:text-white">
                    <input
                      type="checkbox"
                      name="emergencyServices"
                      checked={formData.emergencyServices}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-primary-500"
                    />
                    24/7 Emergency Care
                  </label>

                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer dark:text-white">
                    <input
                      type="checkbox"
                      name="ambulanceService"
                      checked={formData.ambulanceService}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-primary-500"
                    />
                    Ambulance Service Available
                  </label>

                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer dark:text-white">
                    <input
                      type="checkbox"
                      name="is24x7"
                      checked={formData.is24x7}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-primary-500"
                    />
                    Open 24x7
                  </label>
                </div>
              </div>
            </div>

            {/* Section 4: Admin Account Credentials */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" /> Hospital Administrator Account
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Admin Full Name *</label>
                  <input
                    type="text"
                    required
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Admin Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    name="adminPhone"
                    value={formData.adminPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Admin Login Email *</label>
                  <input
                    type="email"
                    required
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="admin@hospital.com"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Create Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
              >
                {loading ? 'Submitting Registration...' : 'Complete Hospital Registration'} <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Already have a hospital account? <Link to="/login" className="text-primary-500 font-bold hover:underline">Log in here</Link>
              </p>
            </div>
          </form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default RegisterHospital;
