import { motion } from 'framer-motion';
import { Laptop, PhoneCall, Microscope, Scissors, Pill, Activity } from 'lucide-react';

const services = [
  { icon: Laptop, title: 'Online Consultation', desc: 'Consult with our specialists from the comfort of your home.' },
  { icon: PhoneCall, title: 'Emergency Care', desc: 'Immediate medical assistance for critical health situations.' },
  { icon: Microscope, title: 'Lab Tests', desc: 'High-precision diagnostic testing and pathology services.' },
  { icon: Scissors, title: 'Surgery', desc: 'Advanced surgical procedures with minimally invasive options.' },
  { icon: Pill, title: 'Pharmacy', desc: 'In-house pharmacy providing authentic medications 24/7.' },
  { icon: Activity, title: 'ICU Support', desc: 'Fully equipped intensive care units for critical monitoring.' },
];

const Services = () => {
  return (
    <section id="services" className="py-24 px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary-500 font-bold tracking-widest uppercase mb-4"
          >
            Our Services
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white"
          >
            Comprehensive Healthcare
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-2xl transition-all group"
            >
              <div className="w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30 group-hover:-rotate-6 transition-transform">
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{service.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
