import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import ContactForm from "@/components/forms/contact-form";
import { SITE, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ThriveParth for partnerships, collaborations, or general inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact ThriveParth"
        description="For partnerships, collaborations, inquiries, or general questions, reach out to us below."
      />

      <Section variant="white">
        <div className="grid lg:grid-cols-3 gap-12">
          <aside className="space-y-8">
            <p className="text-muted leading-relaxed">
              We value meaningful connections and community engagement. Whether you&apos;re interested
              in partnering with ThriveParth, supporting our mission, or learning more about our
              initiatives, we&apos;d love to hear from you.
            </p>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-sage mb-3">Email</h3>
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="inline-flex items-center gap-2 text-forest font-semibold hover:text-sage transition-colors"
              >
                <Mail className="h-4 w-4" />
                {SITE.supportEmail}
              </a>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-sage mb-3">Social</h3>
              <ul className="space-y-2">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-forest transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted">Office location — coming soon</p>
          </aside>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
