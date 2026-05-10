// components/Testimonials.tsx
const Testimonials = () => {
    return (
      <section id="testimonials" className="py-24 bg-[#0A0F1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* New Impact-Focused Heading */}
          <div className="text-center mb-20">
            <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-xs">Proof of Mission</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 tracking-tight">
              The Impact of Successful <br/> <span className="text-slate-500">Integration.</span>
            </h2>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Feature Testimonial */}
            <div className="md:col-span-2 bg-linear-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/20 p-12 rounded-[2.5rem] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  ))}
                </div>
                <p className="text-2xl md:text-3xl font-medium text-white leading-snug">
                  "Finding a community that understood my background was the turning point. The resume workshop didn't just fix my CV; it restored my confidence in a new country."
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-[#0A0F1C] font-bold">OK</div>
                <div>
                  <p className="text-white font-bold text-lg">Omar K.</p>
                  <p className="text-emerald-400 text-sm">Full-Stack Developer</p>
                </div>
              </div>
            </div>
            
            {/* Side Cards */}
            <div className="space-y-6">
              {[
                { name: "Elena R.", role: "Graphic Designer", text: "The settlement checklist saved me months of administrative headache." },
                { name: "Li Wei", role: "Project Manager", text: "Professional, empathetic, and highly effective. I felt seen for the first time." }
              ].map((t, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-4xl hover:border-white/10 transition-colors group">
                  <p className="text-slate-400 mb-8 leading-relaxed italic">"{t.text}"</p>
                  <div>
                    <p className="text-white font-bold">{t.name}</p>
                    <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mt-1">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default Testimonials;