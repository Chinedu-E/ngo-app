// components/ContactForm.tsx
'use client';
import { Send, Paperclip } from 'lucide-react';

const ContactForm = () => {
  return (
    <section id="contact" className="py-24 bg-[#0A0F1C] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect with a Specialist</h2>
          <p className="text-slate-400">Submit your details and we'll reach out within 24 business hours.</p>
        </div>

        <form className="space-y-6 bg-white/3 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Service Interest</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
              <option className="bg-[#0A0F1C]">Career & Resume Services</option>
              <option className="bg-[#0A0F1C]">Volunteer Placement</option>
              <option className="bg-[#0A0F1C]">Settlement Assistance</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Your Message</label>
            <textarea 
              rows={4}
              placeholder="Tell us about your journey..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Optional Resume Field */}
          <div className="relative group">
            <input type="file" className="hidden" id="resume-upload" />
            <label 
              htmlFor="resume-upload"
              className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-slate-400 group-hover:border-emerald-500/50 group-hover:text-emerald-400 cursor-pointer transition-all"
            >
              <Paperclip className="w-4 h-4" />
              <span className="font-medium text-sm">Attach Resume (Optional)</span>
            </label>
          </div>

          <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0A0F1C] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
            Send Message
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;