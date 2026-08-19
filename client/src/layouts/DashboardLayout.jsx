import { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2,
  Users, 
  UserCheck,
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  Activity, 
  User,
  ShieldAlert,
  BarChart3,
  Layers,
  Clock,
  Star,
  Hospital,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Super Admin Links
  const superAdminLinks = [
    { icon: LayoutDashboard, label: 'Platform Overview', path: '/super-admin' },
    { icon: Building2, label: 'Manage Hospitals', path: '/super-admin/hospitals' },
    { icon: Users, label: 'All Users', path: '/super-admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/super-admin/analytics' },
  ];

  // Hospital Admin Links
  const hospitalAdminLinks = [
    { icon: LayoutDashboard, label: 'Hospital Dashboard', path: '/hospital-admin' },
    { icon: Users, label: 'Manage Doctors', path: '/hospital-admin/doctors' },
    { icon: Layers, label: 'Departments', path: '/hospital-admin/departments' },
    { icon: Calendar, label: 'Appointments', path: '/hospital-admin/appointments' },
    { icon: Star, label: 'Reviews', path: '/hospital-admin/reviews' },
    { icon: Settings, label: 'Hospital Profile', path: '/hospital-admin/settings' },
  ];

  // Doctor Links
  const doctorLinks = [
    { icon: LayoutDashboard, label: 'Doctor Dashboard', path: '/doctor' },
    { icon: Calendar, label: 'My Appointments', path: '/doctor/appointments' },
    { icon: Clock, label: 'My Schedule', path: '/doctor/schedule' },
    { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
  ];

  // Patient Links
  const patientLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/patient' },
    { icon: Building2, label: 'Find Hospitals', path: '/hospitals' },
    { icon: Search, label: 'Find Doctors', path: '/doctors' },
    { icon: Calendar, label: 'My Bookings', path: '/patient/appointments' },
    { icon: FileText, label: 'Medical Records', path: '/patient/history' },
  ];

  let links = patientLinks;
  let roleBadge = 'Patient';
  let badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  if (user?.role === 'superAdmin') {
    links = superAdminLinks;
    roleBadge = 'Platform Admin';
    badgeColor = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
  } else if (user?.role === 'hospitalAdmin') {
    links = hospitalAdminLinks;
    roleBadge = user?.hospital?.name || 'Hospital Admin';
    badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  } else if (user?.role === 'doctor') {
    links = doctorLinks;
    roleBadge = 'Doctor';
    badgeColor = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '80px' }}
        className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 overflow-hidden hidden md:flex flex-col shadow-sm"
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30">
              <Activity className="text-white w-6 h-6" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col"
                >
                  <span className="text-xl font-extrabold dark:text-white leading-tight">
                    HealthCare<span className="text-primary-500">Pro</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Network Platform
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="px-6 pb-2">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border truncate ${badgeColor}`}>
              {roleBadge}
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 mt-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium transition-all group ${
                  isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <link.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap text-sm"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            {sidebarOpen && <span>Public Portal</span>}
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 min-h-screen flex flex-col ${sidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'}`}>
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hidden md:block"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Activity className="text-white w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg">HealthCarePro</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 pl-3 sm:pl-5 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight dark:text-white">{user?.name || 'Guest'}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </header>

        {/* Body Container */}
        <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
