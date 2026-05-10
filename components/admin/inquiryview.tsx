// components/admin/InquiryCard.tsx
import { User, FileText, Calendar, ArrowRight } from 'lucide-react';

export const InquiryCard = ({ sub }: { sub: any }) => (
  <div className="bg-white/3 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <User className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h4 className="text-white font-bold">{sub.name}</h4>
          <p className="text-xs text-slate-500">{sub.email}</p>
        </div>
      </div>
      <button className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-white transition-colors">
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-t border-white/5">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Service</span>
        <span className="text-sm text-emerald-400 font-medium">{sub.service}</span>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-white/5">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Resume</span>
        {sub.resume ? (
          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-bold">
            <FileText className="w-3 h-3" /> ATTACHED
          </div>
        ) : (
          <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-1 rounded">MISSING</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-500 mt-2">
        <Calendar className="w-3 h-3" />
        <span className="text-[11px]">{sub.date}</span>
      </div>
    </div>
  </div>
);