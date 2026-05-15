import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

const blogs = [
  { 
    title: 'How to maintain a healthy heart', 
    desc: 'Practical tips and lifestyle changes that can significantly reduce your risk of cardiovascular diseases.',
    date: 'May 10, 2026',
    author: 'Dr. Johnson'
  },
  { 
    title: 'The importance of mental health', 
    desc: 'Understanding the signs of stress and burnout, and how to practice mindfulness in your daily routine.',
    date: 'May 08, 2026',
    author: 'Dr. Chen'
  },
  { 
    title: 'Nutrition tips for kids', 
    desc: 'Healthy meal planning for growing children to ensure they get all the necessary vitamins and minerals.',
    date: 'May 05, 2026',
    author: 'Dr. Davis'
  },
];

const HealthBlog = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary-500 font-bold tracking-widest uppercase mb-4"
            >
              Health Blog
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white"
            >
              Latest Medical Insights
            </motion.h2>
          </div>
          <button className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-all shadow-lg border border-slate-100 dark:border-slate-800">
            View All Blogs <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all group-hover:shadow-2xl group-hover:-translate-y-2">
                {/* Image Placeholder */}
                <div className="w-full h-56 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                  <Activity className="w-16 h-16 text-slate-300 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 px-4 py-1 bg-primary-500 text-white rounded-full text-xs font-bold shadow-lg shadow-primary-500/30">
                    Health Tips
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {blog.date}</span>
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {blog.author}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.desc}
                  </p>
                  
                  <button className="flex items-center gap-2 text-primary-500 font-bold group-hover:gap-4 transition-all">
                    Read More <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Activity } from 'lucide-react';

export default HealthBlog;
