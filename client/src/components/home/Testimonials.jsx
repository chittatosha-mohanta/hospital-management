import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';

const testimonials = [
  { name: 'John Smith', role: 'Patient', rating: 5, text: 'The staff and doctors at HealthCarePro are incredibly professional. The online booking system made it so easy to get an appointment.' },
  { name: 'Linda White', role: 'Patient', rating: 5, text: 'I received the best care during my surgery. The equipment is state-of-the-art and the rooms are very clean and comfortable.' },
  { name: 'Robert Green', role: 'Patient', rating: 4, text: 'Very happy with the pediatric services. My daughter felt very comfortable with the doctors here. Highly recommended!' },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary-500 font-bold tracking-widest uppercase mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white"
          >
            What Our Patients Say
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 relative group"
            >
              <div className="absolute top-8 right-8 text-primary-500/10 group-hover:text-primary-500/20 transition-colors">
                <Quote className="w-16 h-16" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, star) => (
                  <Star key={star} className={`w-4 h-4 ${star < test.rating ? 'text-orange-400 fill-orange-400' : 'text-slate-300'}`} />
                ))}
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 relative z-10 italic">
                "{test.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-600">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{test.name}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
