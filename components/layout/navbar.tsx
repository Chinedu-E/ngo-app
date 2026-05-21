"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${
        solid
          ? "bg-white/95 backdrop-blur-md border-forest/10 py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <Logo size="md" className="group-hover:opacity-90 transition-opacity" />
            <span
              className={`font-serif text-lg sm:text-xl font-semibold tracking-tight truncate ${
                solid ? "text-forest" : "text-white"
              }`}
            >
              {SITE.name}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    solid
                      ? active
                        ? "text-forest bg-forest/5"
                        : "text-muted hover:text-forest"
                      : active
                        ? "text-white bg-white/15"
                        : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              href="/get-support"
              variant={solid ? "primary" : "outline"}
              size="sm"
              className={
                !solid
                  ? "border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/10"
                  : ""
              }
            >
              Get Support
            </Button>
            <Button href="/volunteer" variant={solid ? "secondary" : "primary"} size="sm">
              Volunteer
            </Button>
          </div>

          <button
            type="button"
            className={`lg:hidden p-2 rounded-lg ${solid ? "text-forest" : "text-white"}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-forest/10 bg-white mt-3 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 rounded-b-xl shadow-lg">
            <nav className="pt-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-base font-medium ${
                    pathname === link.href ? "bg-forest/5 text-forest" : "text-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-forest/10">
                <Button href="/get-support" className="w-full">
                  Get Support
                </Button>
                <Button href="/volunteer" variant="secondary" className="w-full">
                  Volunteer
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
