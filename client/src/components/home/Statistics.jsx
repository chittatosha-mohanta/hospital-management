import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, UserCheck, Building2, PhoneForwarded } from 'lucide-react';

const stats = [
  { icon: Users, value: '100+', label: 'Expert Doctors', color: 'text-blue-500' },
  { icon: UserCheck, value: '10K+', label: 'Satisfied Patients', color: 'text-emerald-500' },
  { icon: Building2, value: '15+', label: 'Specialized Departments', color: 'text-purple-500' },
  { icon: PhoneForwarded, value: '24/7', label: 'Emergency Services', color: 'text-orange-500' },
];

const Statistics = () => {
  return (
    <section className="py-20 px-6 bg-primary-600 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-primary-400/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-6 group-hover:bg-white/20 transition-all group-hover:-translate-y-2">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-primary-100 font-bold uppercase text-xs tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
