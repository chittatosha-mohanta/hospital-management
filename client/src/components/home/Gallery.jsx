import { useEffect } from 'react';
import Lenis from 'lenis';
import { ZoomParallax } from '../ui/zoom-parallax';

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
    <section id="facilities" className="w-full bg-slate-950 text-white overflow-hidden relative">
      <ZoomParallax images={galleryImages} />
    </section>
  );
};

export default Gallery;
