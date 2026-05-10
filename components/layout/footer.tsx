// components/Footer.tsx
import Link from 'next/link';
import { Globe2, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050810] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <Globe2 className="text-emerald-500 w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Pathways<span className="text-emerald-500">NGO</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering newcomers through professional excellence and community integration. A non-profit dedicated to your Canadian success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Organization</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#home" className="hover:text-emerald-400 transition-colors">Our Mission</Link></li>
              <li><Link href="#services" className="hover:text-emerald-400 transition-colors">Settlement Services</Link></li>
              <li><Link href="#testimonials" className="hover:text-emerald-400 transition-colors">Success Stories</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition-colors">Partner Portal</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><button className="hover:text-emerald-400 transition-colors text-left">Privacy Policy</button></li>
              <li><button className="hover:text-emerald-400 transition-colors text-left">Terms of Service</button></li>
              <li><button className="hover:text-emerald-400 transition-colors text-left">Help Center</button></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-6">
            <h4 className="text-white font-bold">Stay Updated</h4>
            <p className="text-sm text-slate-400">Get the latest settlement resources in your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
              />
              <button className="p-2 bg-emerald-500 rounded-lg text-[#0A0F1C] hover:bg-emerald-400 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Pathways Settlement Services. All rights reserved.</p>
          <p>Designed with Care for Newcomers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;