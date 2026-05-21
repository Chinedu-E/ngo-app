import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Section, SectionHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ThriveParth's mission, story, and values.",
};

const VALUES = ["Community", "Growth", "Inclusivity", "Empowerment", "Compassion", "Opportunity"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About ThriveParth"
        description="Empowering newcomers, youth, and individuals through support systems, mentorship, and accessible opportunities."
        image="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1920"
      />

      <Section variant="white">
        <div className="max-w-3xl space-y-6 text-muted text-base md:text-lg leading-relaxed">
          <p>
            ThriveParth is a community-focused organization dedicated to empowering newcomers, youth,
            and individuals through support systems, mentorship, guidance, and accessible opportunities.
          </p>
          <p>
            Our organization was built on the belief that people thrive best when they feel connected,
            supported, and empowered within their communities.
          </p>
          <p>
            Through mentorship initiatives, workshops, networking opportunities, wellness conversations,
            and community engagement, ThriveParth aims to help individuals build confidence, meaningful
            relationships, and long-term personal growth.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeader
            eyebrow="Our Story"
            title="Built for transitions, challenges, and new beginnings"
            description="ThriveParth was created with the vision of building a supportive and welcoming environment for individuals navigating transitions, challenges, and new opportunities."
          />
          <div className="relative h-80 rounded-2xl overflow-hidden border border-forest/10">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
              alt="Community members collaborating"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-muted leading-relaxed">
          We recognize that many people, especially newcomers and young individuals, often face
          uncertainty, lack of guidance, and limited support systems. ThriveParth exists to bridge that
          gap through community-driven support and meaningful connections.
        </p>
      </Section>

      <Section variant="white">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <article className="bg-beige rounded-2xl border border-forest/10 p-8">
            <h3 className="font-serif text-2xl text-forest font-semibold mb-3">Mission</h3>
            <p className="text-muted leading-relaxed">
              To empower individuals through mentorship, support, education, and community-driven
              opportunities.
            </p>
          </article>
          <article className="bg-beige rounded-2xl border border-forest/10 p-8">
            <h3 className="font-serif text-2xl text-forest font-semibold mb-3">Vision</h3>
            <p className="text-muted leading-relaxed">
              To build inclusive communities where individuals feel equipped, connected, and inspired to
              thrive.
            </p>
          </article>
        </div>

        <SectionHeader eyebrow="Core Values" title="What guides our work" />
        <div className="flex flex-wrap gap-3">
          {VALUES.map((value) => (
            <span
              key={value}
              className="px-4 py-2 rounded-full bg-forest text-white text-sm font-semibold"
            >
              {value}
            </span>
          ))}
        </div>
      </Section>

      <Section variant="forest">
        <SectionHeader
          eyebrow="Why ThriveParth Matters"
          title="Support systems can transform lives"
          description="By creating accessible spaces for guidance, mentorship, and connection, ThriveParth seeks to positively impact individuals and communities alike."
          light
        />
      </Section>
    </>
  );
}
