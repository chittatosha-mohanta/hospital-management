import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Sparkles, X, Building2 } from 'lucide-react';

const galleryItems = [
  {
    src: '/images/hospitals/hospital_hero.jpg',
    title: 'Flagship Multi-Specialty Hospital',
    category: 'Architecture & Campus',
    description: 'State-of-the-art 750-bed quaternary care medical center with eco-friendly infrastructure.',
  },
  {
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1280&h=720&fit=crop&q=80',
    title: 'Robotic Surgery & Advanced OTs',
    category: 'Surgical Suites',
    description: 'Equipped with latest Da Vinci Xi robotic surgical systems for minimally invasive procedures.',
  },
  {
    src: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1280&h=720&fit=crop&q=80',
    title: 'Critical Care & Level-1 Trauma ICU',
    category: 'Intensive Care',
    description: '24/7 high-dependency life support units with 1:1 dedicated nursing protocols.',
  },
  {
    src: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1280&h=720&fit=crop&q=80',
    title: 'Interventional Cardiology & Cath Lab',
    category: 'Cardiac Sciences',
    description: 'High-precision hybrid cath lab for angioplasty, pacemaker implants, and structural heart care.',
  },
  {
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1280&h=720&fit=crop&q=80',
    title: 'Advanced Diagnostic 3T MRI & PET-CT',
    category: 'Radiology & Imaging',
    description: 'Ultra-low radiation imaging providing crystal-clear diagnostic scans within minutes.',
  },
  {
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1280&h=720&fit=crop&q=80',
    title: '24/7 Emergency & Rapid Response Fleet',
    category: 'Emergency Care',
    description: 'GPS-tracked mobile ICU ambulances with on-board paramedic triage support.',
  },
  {
    src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1280&h=720&fit=crop&q=80',
    title: 'Executive Inpatient Recovery Suites',
    category: 'Patient Rooms',
    description: 'Serene healing environments designed for maximum patient privacy and family comfort.',
  },
  {
    src: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1280&h=720&fit=crop&q=80',
    title: 'Automated Pathology & Genomics Lab',
    category: 'Laboratory Services',
    description: 'NABL-accredited molecular biology diagnostics with integrated barcode tracking.',
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="facilities" className="py-24 px-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Hospital Gallery
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4"
          >
            Our World-Class Facilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            Explore our state-of-the-art medical infrastructure, cutting-edge surgical theatres, and comfortable inpatient healing environments.
          </motion.p>
        </div>

        {/* Gallery Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(item)}
              className={`group relative overflow-hidden rounded-[2rem] bg-slate-200 dark:bg-slate-800 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                i === 0 || i === 5 ? 'md:col-span-2 md:row-span-2 min-h-[340px] md:min-h-[460px]' : 'min-h-[220px]'
              }`}
            >
              {/* Facility Image */}
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent transition-opacity duration-300"></div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg text-white">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Text Badge Info */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-500/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                  {item.category}
                </span>
                <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-primary-300 transition-colors drop-shadow line-clamp-1">
                  {item.title}
                </h3>
                {(i === 0 || i === 5) && (
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-30 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Building2 className="w-3.5 h-3.5" /> {selectedImage.category}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
