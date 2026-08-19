import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Activity, Menu, X, Building2, UserPlus, Stethoscope, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Find Hospitals', to: '/hospitals' },
    { name: 'Find Doctors', to: '/doctors' },
    { name: 'For Hospitals', to: '/register-hospital' },
  ];

  const getDashboardPath = () => {
    if (user?.role === 'superAdmin') return '/super-admin';
    if (user?.role === 'hospitalAdmin') return '/hospital-admin';
    if (user?.role === 'doctor') return '/doctor';
    return '/patient';
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg shadow-sm py-4 border-b border-slate-100 dark:border-slate-800' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              HealthCare<span className="text-primary-500">Pro</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
              National Hospital Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.to} 
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-primary-500 dark:hover:text-primary-400 transition-colors relative group text-sm"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Auth & Theme Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                to={getDashboardPath()} 
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-sm shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 rounded-full font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-sm shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95">
                Join as Patient
              </Link>
              <Link to="/register-hospital" className="px-5 py-2.5 border border-primary-500/30 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-full font-bold text-sm transition-all flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Hospital Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            className="p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-700 dark:text-slate-300 py-1"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="dark:border-slate-800 my-2" />
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link 
                    to={getDashboardPath()} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-xl bg-primary-500 text-white font-bold text-sm"
                  >
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="w-full py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 font-bold dark:text-white text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-primary-500 text-white font-bold text-sm">Register as Patient</Link>
                  <Link to="/register-hospital" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl border border-primary-500 text-primary-500 font-bold text-sm">Register a Hospital</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
