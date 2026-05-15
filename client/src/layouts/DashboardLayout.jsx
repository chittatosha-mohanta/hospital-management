import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Activity,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Doctors', path: '/admin/doctors' },
    { icon: Users, label: 'Patients', path: '/admin/patients' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
  ];

  const doctorLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor' },
    { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
    { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
    { icon: User, label: 'Profile', path: '/doctor/profile' },
  ];

  const patientLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/patient' },
    { icon: Search, label: 'Find Doctors', path: '/patient/search' },
    { icon: Calendar, label: 'My Bookings', path: '/patient/appointments' },
    { icon: FileText, label: 'Medical History', path: '/patient/history' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '80px' }}
        className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 overflow-hidden hidden md:flex flex-col"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="text-white w-6 h-6" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold dark:text-white"
              >
                HMS<span className="text-primary-500">Pro</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                location.pathname === link.path 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <link.icon className={`w-5 h-5 shrink-0 ${location.pathname === link.path ? 'text-white' : 'group-hover:text-primary-500'}`} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'}`}>
        {/* Top Navbar */}
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-40">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700 w-80">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full dark:text-white" 
              />
            </div>
            
            <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <User className="text-slate-500 dark:text-slate-400 w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
