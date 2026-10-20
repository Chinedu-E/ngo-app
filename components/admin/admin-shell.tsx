"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Images, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/layout/logo";
import { SITE } from "@/lib/site";
import { logoutAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
] as const;

function NavLinks({
  pathname,
  onNavigate,
  className = "",
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav className={`space-y-1 ${className}`}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active
                ? "bg-forest text-white font-semibold"
                : "text-muted hover:bg-forest/5 hover:text-forest"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen bg-beige">
      <aside className="w-64 h-screen bg-white border-r border-forest/10 hidden lg:flex flex-col p-6 sticky top-0">
        <div className="mb-10 px-1">
          <Link href="/admin/events" className="flex items-center gap-3 group">
            <Logo size="md" className="group-hover:opacity-90 transition-opacity" />
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold text-forest tracking-tight truncate">
                {SITE.name}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-sage">Admin</p>
            </div>
          </Link>
        </div>

        <NavLinks pathname={pathname} className="flex-1" />

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-red-50 hover:text-red-700 transition-colors mt-auto"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </form>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forest/10 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin/events" className="flex items-center gap-2.5 min-w-0">
              <Logo size="sm" />
              <div className="min-w-0">
                <p className="font-serif text-base font-semibold text-forest tracking-tight truncate">
                  {SITE.name}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sage">Admin</p>
              </div>
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex items-center justify-center rounded-lg border border-forest/15 p-2 text-forest hover:bg-forest/5 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {menuOpen && (
            <div className="pt-4 pb-2 space-y-1 border-t border-forest/10 mt-3">
              <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </form>
            </div>
          )}
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
