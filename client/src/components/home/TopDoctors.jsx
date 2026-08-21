import { motion } from 'framer-motion';
import { Star, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const doctors = [
  { name: 'Dr. Ananya Verma', specialty: 'Cardiologist', hospital: 'Apollo Hospital', image: '/images/doctors/doc_female_1.jpg', exp: '14 Years', rating: 4.9, reviews: 148 },
  { name: 'Dr. Arjun Reddy', specialty: 'Pediatrician', hospital: 'Apollo Hospital', image: '/images/doctors/doc_male_1.jpg', exp: '10 Years', rating: 4.8, reviews: 136 },
  { name: 'Dr. Sonia Gupta', specialty: 'Pediatrician', hospital: 'Fortis Memorial', image: '/images/doctors/doc_female_2.jpg', exp: '11 Years', rating: 4.9, reviews: 140 },
  { name: 'Dr. Rahul Joshi', specialty: 'Cardiologist', hospital: 'Fortis Memorial', image: '/images/doctors/doc_male_2.jpg', exp: '18 Years', rating: 5.0, reviews: 162 },
];

const TopDoctors = () => {
  return (
    <section id="doctors" className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary-500 font-bold tracking-widest uppercase mb-4"
            >
              Meet Our Specialists
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white"
            >
              Top Rated Doctors
            </motion.h2>
          </div>
          <Link to="/doctors" className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-all shadow-lg">
            View All Doctors <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/30 dark:shadow-none hover:shadow-2xl transition-all overflow-hidden">
                {/* Doctor Avatar Image */}
                <div className="w-full aspect-square bg-slate-100 dark:bg-slate-700 rounded-3xl mb-6 relative overflow-hidden shadow-md">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/80 backdrop-blur rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-white">{doc.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-primary-500 transition-colors">{doc.name}</h3>
                <p className="text-primary-500 font-bold text-xs mb-1">{doc.specialty}</p>
                <p className="text-slate-400 text-xs mb-4">{doc.hospital}</p>

                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-6">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {doc.exp}</span>
                  <span className="flex items-center gap-1 underline">{doc.reviews} Reviews</span>
                </div>

                <Link to="/register" className="w-full py-3 bg-primary-50 dark:bg-primary-950/30 text-primary-500 hover:bg-primary-500 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;
