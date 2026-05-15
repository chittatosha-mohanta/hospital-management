import { motion } from 'framer-motion';
import { Users, Clock, ShieldCheck, Microscope, HeartPulse, BadgeDollarSign } from 'lucide-react';

const features = [
  { icon: Users, title: 'Experienced Doctors', desc: 'Our team consists of board-certified specialists with decades of experience.' },
  { icon: Clock, title: '24/7 Emergency Care', desc: 'Critical care units and ambulance services available round the clock.' },
  { icon: Microscope, title: 'Modern Equipment', desc: 'Utilizing state-of-the-art diagnostic and surgical technology.' },
  { icon: Clock, title: 'Online Appointment', desc: 'Skip the queue with our easy-to-use digital booking system.' },
  { icon: ShieldCheck, title: 'Trusted Healthcare', desc: 'Accredited by international health organizations for safety and quality.' },
  { icon: BadgeDollarSign, title: 'Affordable Treatment', desc: 'Premium healthcare services designed to be accessible to everyone.' },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary-500 font-bold tracking-widest uppercase mb-4">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8">
              We Are Committed to <br /> 
              <span className="text-primary-500">Your Better Health</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              At HealthCarePro, we believe that quality healthcare should be compassionate, comprehensive, and convenient. Our multidisciplinary approach ensures you receive the best possible care tailored to your needs.
            </p>
            
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">15k+</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Happy Patients</p>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">120+</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Expert Doctors</p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-primary-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-primary-500 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
