import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary-500 font-bold tracking-widest uppercase mb-4"
            >
              Contact Us
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8"
            >
              Get in Touch with Our <br />
              <span className="text-primary-500">Medical Team</span>
            </motion.h2>
            
            <div className="space-y-8 mt-12">
              {[
                { icon: MapPin, title: 'Our Location', detail: '123 Medical Plaza, Health Street, NY 10001', color: 'bg-blue-500' },
                { icon: Phone, title: 'Call Us Now', detail: '+1 (800) 123-4567, +1 (800) 987-6543', color: 'bg-emerald-500' },
                { icon: Mail, title: 'Email Address', detail: 'contact@healthcarepro.com, emergency@hcp.com', color: 'bg-purple-500' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-6 group"
                >
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-${item.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                    <item.icon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-widest text-xs opacity-60">{item.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white font-semibold" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Subject</label>
                <input type="text" placeholder="Inquiry about services" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white font-semibold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Message</label>
                <textarea rows="4" placeholder="How can we help you?" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white font-semibold resize-none"></textarea>
              </div>

              <button className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group">
                Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
