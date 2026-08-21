import { useEffect } from 'react';
import Lenis from 'lenis';
import { ZoomParallax } from '../ui/zoom-parallax';
import { Sparkles } from 'lucide-react';

const galleryImages = [
  {
    src: '/images/hospitals/hospital_hero.jpg',
    alt: 'Medica International Multi-Specialty Hospital',
    title: 'Flagship Tertiary Hospital',
    subtitle: 'Modern Architecture & Green Campus',
  },
  {
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1280&h=720&fit=crop&q=80',
    alt: 'Modular Operation Theatres & Robotic Surgery',
    title: 'Robotic Surgery Suite',
    subtitle: 'Da Vinci Xi Robotic Systems',
  },
  {
    src: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1280&h=720&fit=crop&q=80',
    alt: 'Critical Care & Neonatal ICU Unit',
    title: 'Level 1 Trauma & ICU',
    subtitle: '24/7 Critical Life Support',
  },
  {
    src: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1280&h=720&fit=crop&q=80',
    alt: 'Advanced Cardiology Cath Lab',
    title: 'Interventional Cath Lab',
    subtitle: 'High Precision Cardiac Sciences',
  },
  {
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1280&h=720&fit=crop&q=80',
    alt: 'Diagnostic Imaging 3T MRI & PET-CT',
    title: 'Advanced Diagnostic Center',
    subtitle: '3 Tesla MRI & Spectral CT',
  },
  {
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1280&h=720&fit=crop&q=80',
    alt: '24x7 Emergency & Ambulance Network',
    title: '24/7 Emergency Care',
    subtitle: 'Rapid Response Fleet',
  },
  {
    src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1280&h=720&fit=crop&q=80',
    alt: 'Patient Recovery Suites & Wellness Lounge',
    title: 'Executive Inpatient Suites',
    subtitle: 'Compassionate Healing Environment',
  },
];

const Gallery = () => {
  useEffect(() => {
    let lenis;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    } catch {
      // Lenis optional fallback
    }

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <section id="facilities" className="w-full bg-slate-900 text-white overflow-hidden relative">
      {/* Header section with radial spotlight */}
      <div className="relative flex flex-col items-center justify-center pt-28 pb-12 px-6 text-center z-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-500/20 via-primary-700/10 to-transparent blur-[80px]"
        />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" /> World-Class Hospital Infrastructure
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
          Our Advanced Medical Facilities
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Scroll down to experience an immersive zoom walkthrough of our state-of-the-art surgical suites, robotic operating rooms, and patient-first healing spaces.
        </p>
      </div>

      {/* Interactive Zoom Parallax */}
      <ZoomParallax images={galleryImages} />
    </section>
  );
};

export default Gallery;
