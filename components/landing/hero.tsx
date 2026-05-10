// components/Hero.tsx
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-[#0A0F1C]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Official Settlement Services
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Empowering your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
                Canadian Dream.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              We provide newcomers with the professional tools and community
              networks necessary to thrive. From resume mastery to local
              placement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="w-full sm:w-auto group px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0A0F1C] font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-7 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all text-center">
                Learn More
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-400 font-medium">
                  IRCC Compliant
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-400 font-medium">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual (The "Modern" touch) */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000"
                alt="Newcomer professional"
                width={600}
                height={700}
                className="object-cover h-[600px] w-full scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0A0F1C]/80 via-transparent to-transparent" />
            </div>

            {/* Floating UI Elements for Polish */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold">✓</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Resume Verified
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Application Ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
