import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { PageHero, Section, SectionHeader } from "@/components/ui/section";
import { PROGRAMS } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore ThriveParth programs for newcomers, youth, career guidance, wellness, and community events.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title="Our Programs"
        description="ThriveParth's programs are designed to empower individuals through guidance, mentorship, education, community engagement, and meaningful opportunities."
        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1920"
      />

      <Section variant="white">
        <div className="space-y-24">
          {PROGRAMS.map((program, index) => (
            <article
              key={program.slug}
              className={`grid lg:grid-cols-2 gap-10 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <p className="text-xs font-bold uppercase tracking-widest text-sage mb-2">
                  Program {index + 1}
                </p>
                <h2 className="font-serif text-3xl text-forest font-semibold mb-4">{program.title}</h2>
                <p className="text-muted leading-relaxed mb-6">{program.short}</p>
                <ul className="space-y-3">
                  {program.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage/20">
                        <Check className="h-3.5 w-3.5 text-forest" />
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`relative h-72 md:h-96 rounded-2xl overflow-hidden border border-forest/10 ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <SectionHeader
            title="Ready to get started?"
            description="Reach out and we'll help you find the right program for your journey."
            align="center"
          />
          <Button href="/get-support" size="lg">
            Get Support
          </Button>
        </div>
      </Section>
    </>
  );
}
