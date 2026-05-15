import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 px-6 text-slate-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                HealthCare<span className="text-primary-500">Pro</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Providing world-class healthcare with a personal touch. Our mission is to make quality health services accessible to everyone.
            </p>
            <div className="flex gap-4">
              {[Activity, Activity, Activity, Activity].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 hover:bg-primary-500 hover:text-white rounded-lg flex items-center justify-center transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Services', 'Doctors', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary-500 transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Departments
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedic', 'Dental'].map((dept) => (
                <li key={dept}>
                  <a href="#" className="hover:text-primary-500 transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                    {dept}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Emergency */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Emergency Contact
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-red-500 rounded-full"></span>
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Emergency Call</p>
                  <p className="text-white font-bold text-lg">+1 (800) 911-HELP</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500/10 text-primary-500 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Send us Mail</p>
                  <p className="text-white font-bold">contact@healthcarepro.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">© 2026 HealthCarePro. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-slate-500 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
