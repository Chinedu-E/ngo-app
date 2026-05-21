import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/section";
import SupportForm from "@/components/forms/support-form";
import { SUPPORT_CATEGORIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get Support",
  description: "Request guidance, mentorship, or community support from ThriveParth.",
};

export default function GetSupportPage() {
  return (
    <>
      <PageHero
        title="Get Support"
        description="If you're looking for guidance, mentorship, resources, or community support, ThriveParth is here to help."
      />

      <Section variant="white">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Our goal is to provide a safe, welcoming, and supportive environment where individuals
                can access opportunities, guidance, and meaningful connections.
              </p>
              <p>
                Whether you&apos;re navigating a new environment, seeking mentorship, exploring
                opportunities, or simply looking for community support, we encourage you to reach out.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-forest font-semibold mb-4">Support Categories</h3>
              <ul className="space-y-2">
                {SUPPORT_CATEGORIES.map((cat) => (
                  <li key={cat} className="text-sm text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-2">
            <SupportForm />
          </div>
        </div>
      </Section>
    </>
  );
}
