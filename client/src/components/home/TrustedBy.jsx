import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Building2, Stethoscope, Activity, Cross, Award } from 'lucide-react';

const partners = [
  { name: 'Apollo Hospitals', tag: 'Quaternary Care Network', icon: HeartPulse, color: 'text-rose-500' },
  { name: 'Fortis Healthcare', tag: 'Multi-Specialty Trust', icon: ShieldCheck, color: 'text-emerald-500' },
  { name: 'AIIMS Institute', tag: 'Apex Research Center', icon: Building2, color: 'text-blue-500' },
  { name: 'Max Super Specialty', tag: 'Tertiary Care Division', icon: Activity, color: 'text-indigo-500' },
  { name: 'Manipal Hospitals', tag: 'Healthcare Enterprise', icon: Cross, color: 'text-teal-500' },
  { name: 'Medanta The Medicity', tag: 'Heart & Cancer Institute', icon: Stethoscope, color: 'text-amber-500' },
  { name: 'Narayana Health', tag: 'Cardiac Sciences Hub', icon: Award, color: 'text-cyan-500' },
  { name: 'Mayo Clinic Affiliate', tag: 'Global Clinical Partner', icon: ShieldCheck, color: 'text-purple-500' },
];

export default function TrustedBy() {
  // Duplicate array for seamless infinite loop
  const marqueeList = [...partners, ...partners];

  return (
    <section className="py-12 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Trusted by Premier Healthcare Networks & Global Medical Institutions
        </p>
      </div>

      {/* Infinite Moving Marquee (Right to Left) */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left & Right gradient blur fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-slate-100 dark:from-slate-900/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-slate-100 dark:from-slate-900/90 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 sm:gap-8 items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 28,
            repeat: Infinity,
          }}
        >
          {marqueeList.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all shrink-0 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${partner.color}`} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-primary-500 transition-colors">
                    {partner.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    {partner.tag}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
