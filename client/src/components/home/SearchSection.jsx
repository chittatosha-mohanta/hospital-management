import { Search, ChevronDown, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchSection = () => {
  return (
    <section className="relative -mt-16 z-30 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800"
        >
          <div className="grid lg:grid-cols-4 gap-6 items-center">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Search Doctor</label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Doctor name or specialty..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white font-semibold"
                />
              </div>
            </div>

            {/* Department Select */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Department</label>
              <div className="relative">
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
                <select className="w-full pl-14 pr-10 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 appearance-none dark:text-white font-semibold">
                  <option>All Departments</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedic</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="pt-6">
              <button className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                Search <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchSection;
