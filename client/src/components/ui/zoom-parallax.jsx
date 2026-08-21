import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Sparkles } from 'lucide-react';

export function ZoomParallax({ images }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Scales for parallax
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 4.5]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [centerScale, scale5, scale6, scale5, scale6, scale8, scale9];

  // Header fades out as user scrolls
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.25], [0, -30]);

  // Surrounding images fade out smoothly as center zooms in
  const outerOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7], [1, 0.5, 0]);

  // Center card initial badge fades out
  const centerCardBadgeOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Full-screen overlay content reveals at the end of the zoom
  const heroContentOpacity = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);
  const heroContentY = useTransform(scrollYProgress, [0.65, 0.95], [20, 0]);

  return (
    <div ref={container} className="relative h-[180vh] w-full bg-slate-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Floating Header Inside Sticky Frame */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-20 z-30 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" /> World-Class Hospital Infrastructure
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
            Our Advanced Medical Facilities
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Scroll down to zoom into our state-of-the-art operating rooms and patient facilities.
          </p>
        </motion.div>

        {/* 7 Parallax Zoom Items */}
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
              className={`absolute inset-0 flex h-full w-full items-center justify-center pointer-events-none ${
                index === 1
                  ? '[&>div]:!-top-[26vh] [&>div]:!left-[6vw] [&>div]:!h-[24vh] [&>div]:!w-[30vw]'
                  : ''
              } ${
                index === 2
                  ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[36vh] [&>div]:!w-[22vw]'
                  : ''
              } ${
                index === 3
                  ? '[&>div]:!left-[26vw] [&>div]:!h-[25vh] [&>div]:!w-[22vw]'
                  : ''
              } ${
                index === 4
                  ? '[&>div]:!top-[26vh] [&>div]:!left-[6vw] [&>div]:!h-[22vh] [&>div]:!w-[20vw]'
                  : ''
              } ${
                index === 5
                  ? '[&>div]:!top-[26vh] [&>div]:!-left-[24vw] [&>div]:!h-[22vh] [&>div]:!w-[26vw]'
                  : ''
              } ${
                index === 6
                  ? '[&>div]:!top-[22vh] [&>div]:!left-[25vw] [&>div]:!h-[16vh] [&>div]:!w-[16vw]'
                  : ''
              }`}
            >
              <div
                className={`relative ${
                  isCenter ? 'h-[34vh] w-[38vw]' : 'h-[22vh] w-[24vw]'
                } rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-700/60 pointer-events-auto`}
              >
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
                
                {title && (
                  <motion.div
                    style={{ opacity: isCenter ? centerCardBadgeOpacity : 1 }}
                    className="absolute bottom-3 left-4 right-4 text-left pointer-events-none"
                  >
                    <p className="text-white font-bold text-xs sm:text-sm drop-shadow truncate">
                      {title}
                    </p>
                    {subtitle && (
                      <p className="text-primary-300 text-[10px] font-semibold truncate">
                        {subtitle}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Dynamic Zoomed-In Content Card */}
        <motion.div
          style={{ opacity: heroContentOpacity, y: heroContentY }}
          className="absolute bottom-12 z-30 max-w-xl mx-auto px-6 text-center pointer-events-auto"
        >
          <div className="p-6 sm:p-7 glass rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-2xl bg-slate-950/85">
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
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2 hover:scale-105"
              >
                Explore Hospitals <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/doctors"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all border border-white/10 hover:scale-105"
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
