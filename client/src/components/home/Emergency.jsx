import { motion } from 'framer-motion';
import { Phone, Siren, Truck, Clock } from 'lucide-react';

const Emergency = () => {
  return (
    <section className="py-24 px-6 bg-red-600 relative overflow-hidden">
      {/* Background Animated Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-white/5 rounded-full animate-ping opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-white/10 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] border border-white/20 flex flex-col lg:flex-row items-center gap-12">
          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-6">
              <Siren className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Emergency Support <br />
              <span className="text-white/70">Available 24/7</span>
            </h2>
            <p className="text-xl text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              In case of any medical emergency, our ambulance services and trauma center are ready to assist you immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-2xl">
                <Phone className="w-10 h-10 text-red-600 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-1">Emergency Number</p>
              <h3 className="text-3xl font-black text-white">+1 (800) 911-HELP</h3>
            </div>
            
            <div className="h-20 w-px bg-white/20 hidden sm:block"></div>

            <button className="px-10 py-5 bg-white text-red-600 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-2xl flex items-center gap-3 active:scale-95">
              <Truck className="w-6 h-6" /> Call Ambulance
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Emergency;
