import Link from "next/link";
import { Mail } from "lucide-react";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "@/lib/site";
import NewsletterForm from "@/components/forms/newsletter-form";
import Logo from "@/components/layout/logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Logo size="lg" />
              <span className="font-serif text-lg sm:text-xl font-semibold">{SITE.name}</span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed max-w-xs">
              {SITE.description}
            </p>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="inline-flex items-center gap-2 text-sm text-sage hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              {SITE.supportEmail}
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-sage mb-4">Navigate</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-sage mb-4">Connect</h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/50">Office location — coming soon</p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-sage mb-4">Newsletter</h4>
            <p className="text-sm text-white/75 mb-4">
              Receive updates about programs, workshops, events, and community opportunities.
            </p>
            <NewsletterForm variant="footer" />
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p>Building inclusive communities, together.</p>
        </div>
      </div>
    </footer>
  );
}
