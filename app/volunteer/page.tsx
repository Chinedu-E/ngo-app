import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Section } from "@/components/ui/section";
import VolunteerForm from "@/components/forms/volunteer-form";
import { VOLUNTEER_AREAS } from "@/lib/site";

const VOLUNTEER_IMAGE =
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Join ThriveParth as a volunteer and help build stronger, more supportive communities.",
};

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        title="Volunteer With ThriveParth"
        description="Join ThriveParth's mission by contributing your time, skills, experience, and passion toward building stronger and more supportive communities."
        image={`${VOLUNTEER_IMAGE}&w=1920`}
      />

      <Section variant="white">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Our volunteers play an important role in helping ThriveParth create meaningful experiences,
              programs, and opportunities for individuals in the community.
            </p>
            <p>
              Whether you&apos;re interested in mentorship, event support, outreach, creative
              contributions, or administrative assistance, there are many ways to get involved.
            </p>
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden border border-forest/10">
            <Image
              src={`${VOLUNTEER_IMAGE}&w=1000`}
              alt="Volunteers packing food donations for the community"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="font-serif text-2xl text-forest font-semibold mb-6">Volunteer Opportunities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VOLUNTEER_AREAS.map((area) => (
              <div
                key={area}
                className="bg-beige rounded-xl border border-forest/10 px-5 py-4 text-sm font-medium text-forest"
              >
                {area}
              </div>
            ))}
          </div>
        </div>

        <VolunteerForm />
      </Section>
    </>
  );
}
