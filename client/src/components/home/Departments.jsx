import { motion } from 'framer-motion';
import { Heart, Activity, Brain, Bone, Baby, Sparkles, ArrowRight } from 'lucide-react';

const departments = [
  { icon: Heart, name: 'Cardiology', desc: 'Comprehensive heart care and cardiovascular treatments.', color: 'bg-red-500' },
  { icon: Sparkles, name: 'Dental', desc: 'Expert dental care and oral surgery services.', color: 'bg-blue-500' },
  { icon: Brain, name: 'Neurology', desc: 'Advanced neurological diagnostics and treatment.', color: 'bg-purple-500' },
  { icon: Bone, name: 'Orthopedic', desc: 'Specialized bone, joint, and spine healthcare.', color: 'bg-orange-500' },
  { icon: Baby, name: 'Pediatrics', desc: 'Dedicated healthcare for children and infants.', color: 'bg-emerald-500' },
  { icon: Activity, name: 'Dermatology', desc: 'Skin care treatments and diagnostic services.', color: 'bg-pink-500' },
];

const Departments = () => {
  return (
    <section id="departments" className="py-24 px-6 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary-500 font-bold tracking-widest uppercase mb-4"
          >
            Our Departments
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white"
          >
            Specialized Healthcare Services
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group transition-all"
            >
              <div className={`w-16 h-16 ${dept.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${dept.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                <dept.icon className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{dept.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {dept.desc}
              </p>
              <button className="flex items-center gap-2 text-primary-500 font-bold group-hover:gap-4 transition-all">
                Learn More <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Departments;
