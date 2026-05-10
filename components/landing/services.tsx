// components/Services.tsx
import { ArrowUpRight, ShieldCheck, Briefcase, MapPin } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'Strategic Career Mapping',
    desc: 'Beyond just a resume—we align your international expertise with the local industry demands.',
    icon: Briefcase,
    tags: ['Resume Optimization', 'LinkedIn Branding']
  },
  {
    id: '02',
    title: 'Civic & Community Ties',
    desc: 'Access curated volunteer roles that serve as a bridge to full-time local employment.',
    icon: MapPin,
    tags: ['Network Building', 'Local Placements']
  },
  {
    id: '03',
    title: 'Foundation Services',
    desc: 'Expert guidance through the critical first 90 days of settlement and documentation.',
    icon: ShieldCheck,
    tags: ['IRCC Support', 'Housing Search']
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-[#0A0F1C] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Full-spectrum support for your <span className="text-emerald-400">new chapter.</span>
            </h2>
          </div>
          <p className="text-slate-400 max-w-sm mb-2 font-medium">
            We provide the roadmap to economic independence through professional excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-white/10">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group grid grid-cols-1 md:grid-cols-12 py-16 border-b border-white/10 hover:bg-white/2 transition-all px-4"
            >
              <div className="md:col-span-1 text-emerald-500/50 font-mono text-xl">
                {service.id}
              </div>
              <div className="md:col-span-4 mt-4 md:mt-0 flex items-start gap-4">
                <service.icon className="w-6 h-6 text-emerald-500 mt-1" />
                <h3 className="text-2xl font-bold text-white">{service.title}</h3>
              </div>
              <div className="md:col-span-5 mt-4 md:mt-0">
                <p className="text-slate-400 leading-relaxed max-w-md">
                  {service.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 mt-6 md:mt-0 flex md:justify-end items-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;