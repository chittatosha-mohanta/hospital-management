import Navbar from '../../components/home/Navbar';
import Hero from '../../components/home/Hero';
import TrustedBy from '../../components/home/TrustedBy';
import SearchSection from '../../components/home/SearchSection';
import Departments from '../../components/home/Departments';
import TopDoctors from '../../components/home/TopDoctors';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import Statistics from '../../components/home/Statistics';
import QuickAppointment from '../../components/home/QuickAppointment';
import Services from '../../components/home/Services';
import Testimonials from '../../components/home/Testimonials';
import Emergency from '../../components/home/Emergency';
import HealthBlog from '../../components/home/HealthBlog';
import Gallery from '../../components/home/Gallery';
import Contact from '../../components/home/Contact';
import Footer from '../../components/home/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative dark:bg-slate-950">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary-500 origin-left z-[110]"
        style={{ scaleX }}
      />

      <Navbar />
      
      <main>
        <Hero />
        <TrustedBy />
        <SearchSection />
        <WhyChooseUs />
        <Departments />
        <Statistics />
        <TopDoctors />
        <QuickAppointment />
        <Services />
        <Testimonials />
        <Emergency />
        <HealthBlog />
        <Gallery />
        <Contact />
      </main>

      <Footer />

      {/* Floating Appointment Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/40 z-50 hover:scale-110 active:scale-95 transition-all group"
      >
        <Calendar className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute right-20 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Book Appointment
        </span>
      </motion.button>
    </div>
  );
};

import { Calendar } from 'lucide-react';

export default Home;
