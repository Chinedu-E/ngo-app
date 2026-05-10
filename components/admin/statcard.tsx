// components/admin/StatCard.tsx
export const StatCard = ({ label, value, trend }: { label: string; value: string; trend: string }) => (
    <div className="bg-white/3 border border-white/10 p-6 rounded-2xl">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <h4 className="text-3xl font-bold text-white">{value}</h4>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
          {trend}
        </span>
      </div>
    </div>
  );