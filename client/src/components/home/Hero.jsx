import { motion } from 'framer-motion';
import { ArrowRight, Search, Phone, Clock, Heart, Shield, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const RANDOM_ICONS = [
  { x: [12, -12, 12], y: [18, -18, 18], top: '15%', left: '10%', duration: 10 },
  { x: [-15, 15, -15], y: [8, -8, 8], top: '45%', left: '85%', duration: 12 },
  { x: [10, -10, 10], y: [-15, 15, -15], top: '75%', left: '20%', duration: 14 },
  { x: [-8, 8, -8], y: [12, -12, 12], top: '30%', left: '70%', duration: 16 },
  { x: [14, -14, 14], y: [-10, 10, -10], top: '60%', left: '40%', duration: 18 },
  { x: [-12, 12, -12], y: [14, -14, 14], top: '85%', left: '60%', duration: 20 }
];

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 -z-10 w-[50%] h-[100%] bg-gradient-to-l from-primary-50/50 to-transparent dark:from-primary-950/20"></div>
      <div className="absolute -top-24 -left-24 -z-10 w-96 h-96 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex gap-4 mb-6">
            <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              24/7 Healthcare Support
            </span>
            <span className="px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-bold flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Trusted Hospital
            </span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8">
            Your Health, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Our Priority</span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
            Experience world-class healthcare with our team of specialized doctors and modern technology. Booking appointments has never been easier.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/register" className="px-10 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-lg font-bold shadow-xl shadow-primary-500/30 flex items-center justify-center gap-2 group transition-all">
              Book Appointment <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all">
              Find Doctors <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Emergency Badge */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-4 p-4 glass rounded-3xl"
          >
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <Phone className="text-white w-6 h-6 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Emergency Call</p>
              <p className="text-xl font-black text-slate-900 dark:text-white">+1 (800) 123-4567</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Visual Elements */}
        <div className="relative flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 w-full max-w-md aspect-square bg-gradient-to-br from-primary-500 to-primary-700 rounded-[3rem] shadow-2xl overflow-hidden group"
          >
            {/* I will use a placeholder effect here, in a real app this would be a doctor image */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] flex items-center justify-center">
              <Stethoscope className="w-32 h-32 text-white/20 group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-10 -left-10 p-4 glass rounded-2xl shadow-xl z-20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Heart className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">Success Rate</p>
                  <p className="text-xs text-slate-500">98% Satisfied</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1 }}
              className="absolute bottom-10 -right-10 p-4 glass rounded-2xl shadow-xl z-20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm dark:text-white">Quick Consult</p>
                  <p className="text-xs text-slate-500">Less than 10 min</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Medical Icons Background */}
          <div className="absolute top-0 right-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
            {RANDOM_ICONS.map((icon, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: icon.y,
                  x: icon.x,
                  rotate: [0, 360]
                }}
                transition={{ repeat: Infinity, duration: icon.duration, ease: "linear" }}
                className="absolute text-primary-200/40 dark:text-primary-800/20"
                style={{ 
                  top: icon.top, 
                  left: icon.left,
                }}
              >
                <Stethoscope className="w-12 h-12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
