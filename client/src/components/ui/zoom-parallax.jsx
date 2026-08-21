import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';

export function ZoomParallax({ images }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Scales for parallax
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 4.2]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [centerScale, scale5, scale6, scale5, scale6, scale8, scale9];

  // Surrounding images fade out as user zooms in on the center photo
  const outerOpacity = useTransform(scrollYProgress, [0, 0.45, 0.75], [1, 0.6, 0]);

  // Full-screen hero content reveals when center photo is zoomed in
  const centerHeroOpacity = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);
  const centerHeroY = useTransform(scrollYProgress, [0.65, 0.95], [30, 0]);

  return (
    <div ref={container} className="relative h-[240vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-slate-950">
        {images.map(({ src, alt, title, subtitle }, index) => {
          const isCenter = index === 0;
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{
                scale,
                opacity: isCenter ? 1 : outerOpacity,
                zIndex: isCenter ? 20 : 10,
              }}
              className={`absolute top-0 flex h-full w-full items-center justify-center pointer-events-none ${
                index === 1
                  ? '[&>div]:!-top-[28vh] [&>div]:!left-[5vw] [&>div]:!h-[28vh] [&>div]:!w-[32vw]'
                  : ''
              } ${
                index === 2
                  ? '[&>div]:!-top-[10vh] [&>div]:!-left-[26vw] [&>div]:!h-[42vh] [&>div]:!w-[22vw]'
                  : ''
              } ${
                index === 3
                  ? '[&>div]:!left-[28vw] [&>div]:!h-[28vh] [&>div]:!w-[24vw]'
                  : ''
              } ${
                index === 4
                  ? '[&>div]:!top-[28vh] [&>div]:!left-[6vw] [&>div]:!h-[26vh] [&>div]:!w-[22vw]'
                  : ''
              } ${
                index === 5
                  ? '[&>div]:!top-[28vh] [&>div]:!-left-[24vw] [&>div]:!h-[26vh] [&>div]:!w-[28vw]'
                  : ''
              } ${
                index === 6
                  ? '[&>div]:!top-[24vh] [&>div]:!left-[26vw] [&>div]:!h-[18vh] [&>div]:!w-[18vw]'
                  : ''
              }`}
            >
              <div
                className={`relative ${
                  isCenter ? 'h-[30vh] w-[32vw]' : 'h-[25vh] w-[25vw]'
                } rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-700/60 group pointer-events-auto`}
              >
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                {title && (
                  <div className="absolute bottom-3 left-4 right-4 text-left pointer-events-none">
                    <p className="text-white font-bold text-xs sm:text-sm drop-shadow-md truncate">
                      {title}
                    </p>
                    {subtitle && (
                      <p className="text-primary-300 text-[10px] font-semibold truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Dynamic Zoomed-In Overlay Info Card */}
        <motion.div
          style={{ opacity: centerHeroOpacity, y: centerHeroY }}
          className="absolute bottom-12 z-30 max-w-xl mx-auto px-6 text-center pointer-events-auto"
        >
          <div className="p-6 sm:p-8 glass rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-xl bg-slate-900/80">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-wider mb-2 border border-primary-500/30">
              <Building2 className="w-3.5 h-3.5" /> Flagship Medical Centre
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Pioneering Healthcare Excellence
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
              JCI & NABH accredited quaternary facilities equipped with hybrid cath labs, robotic surgery, and dedicated 24x7 emergency response units.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/hospitals"
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2"
              >
                Explore Hospitals <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/doctors"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all border border-white/10"
              >
                Find Doctors
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ZoomParallax;
