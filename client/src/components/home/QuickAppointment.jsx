import { motion } from 'framer-motion';
import { Calendar, User, ChevronDown, Stethoscope } from 'lucide-react';

const QuickAppointment = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/10 skew-x-12 translate-x-12"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Ready to Book Your <br />
                <span className="text-primary-400">Appointment?</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-md">
                Fill out this quick form and our representative will call you back to confirm your booking.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: User, text: 'Trusted by 10,000+ patients' },
                  { icon: Calendar, text: 'Flexible scheduling options' },
                  { icon: Stethoscope, text: 'Access to 100+ top specialists' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-300 font-semibold">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                      <item.icon className="text-primary-400 w-5 h-5" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl"
            >
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Enter your name"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Department</label>
                    <div className="relative">
                      <select className="w-full pl-6 pr-10 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 appearance-none dark:text-white font-semibold">
                        <option>Cardiology</option>
                        <option>Neurology</option>
                        <option>Pediatrics</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Select Date</label>
                    <input 
                      type="date"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <button className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 pt-4">
                  Book Appointment Now
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAppointment;
