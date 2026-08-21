import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    toast.success('Your message has been sent to our medical coordinators!');
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="p-8 sm:p-10 rounded-[2.5rem] bg-slate-900 border border-slate-800/80 shadow-2xl relative overflow-hidden"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

      {submitted ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
          <p className="text-slate-400 text-sm max-w-xs">
            Thank you for reaching out. Our emergency and medical support desk will respond shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-5 py-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-white placeholder:text-slate-500 text-sm font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-5 py-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-white placeholder:text-slate-500 text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Inquiry about services"
              className="w-full px-5 py-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-white placeholder:text-slate-500 text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Message
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you?"
              className="w-full px-5 py-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-white placeholder:text-slate-500 text-sm font-medium transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
          >
            Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </form>
      )}
    </motion.div>
  );
}
