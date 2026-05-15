import { motion } from 'framer-motion';
import { Camera, Maximize2 } from 'lucide-react';

const Gallery = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary-500 font-bold tracking-widest uppercase mb-4"
          >
            Hospital Gallery
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white"
          >
            Our World-Class Facilities
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800 ${
                i === 0 || i === 5 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/40 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500 z-10 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                  <Maximize2 className="text-primary-500 w-5 h-5" />
                </div>
              </div>
              
              <div className="w-full h-full min-h-[200px] flex items-center justify-center">
                <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700 group-hover:scale-125 transition-transform duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
