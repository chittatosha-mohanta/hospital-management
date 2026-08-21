import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

const contactItems = [
  {
    icon: MapPin,
    title: 'OUR LOCATION',
    detail: '123 Medical Plaza, Health Street, NY 10001',
    color: 'bg-blue-600 shadow-blue-500/20',
  },
  {
    icon: Phone,
    title: 'CALL US NOW',
    detail: '+1 (800) 123-4567, +1 (800) 987-6543',
    color: 'bg-emerald-500 shadow-emerald-500/20',
  },
  {
    icon: Mail,
    title: 'EMAIL ADDRESS',
    detail: 'contact@healthcarepro.com, emergency@hcp.com',
    color: 'bg-purple-600 shadow-purple-500/20',
  },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col justify-center h-full">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-primary-500 font-bold text-xs tracking-widest uppercase mb-3"
      >
        Contact Us
      </motion.p>
      
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8"
      >
        Get in Touch with <br />
        <span className="text-primary-500">Our Team</span>
      </motion.h2>

      <div className="space-y-6 mt-4">
        {contactItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-5 group"
          >
            <div
              className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white group-hover:scale-110 transition-transform duration-300`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                {item.title}
              </p>
              <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base leading-snug">
                {item.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
