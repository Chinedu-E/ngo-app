// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe2 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener to change opacity as user moves down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#0A0F1C]/80 backdrop-blur-lg py-4 border-white/10' 
          : 'bg-transparent py-6 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Brand - Linked to Home */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="bg-emerald-500 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <Globe2 className="text-[#0A0F1C] w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Pathways<span className="text-emerald-500">NGO</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-white/10 mx-2" />
            <Link
              href="/admin"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl border border-white/10 transition-all"
            >
              Portal Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0F1C] border-b border-white/10 p-4 space-y-4 animate-in fade-in zoom-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-lg font-medium text-slate-300 hover:text-emerald-400 rounded-xl"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/admin"
            className="block w-full text-center py-4 bg-emerald-500 text-[#0A0F1C] font-bold rounded-xl"
          >
            Portal Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;