// components/admin/sidebar.tsx
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut } from 'lucide-react';

export const AdminSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: MessageSquare, label: 'Inquiries', active: false },
    { icon: Users, label: 'Newcomers', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-64 h-screen bg-[#0A0F1C] border-r border-white/10 md:flex flex-col p-6 hidden lg:flex">
      <div className="mb-10 px-2">
        <span className="text-xl font-bold text-white tracking-tight">
          Admin<span className="text-emerald-500">Panel</span>
        </span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              item.active ? 'bg-emerald-500 text-[#0A0F1C] font-bold' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors mt-auto">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

