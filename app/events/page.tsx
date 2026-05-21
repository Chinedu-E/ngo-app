import type { Metadata } from "next";
import { PageHero, Section, SectionHeader } from "@/components/ui/section";
import { EVENTS } from "@/lib/site";
import EventCard from "@/components/events/event-card";

export const metadata: Metadata = {
  title: "Events",
  description: "Workshops, networking sessions, and community events hosted by ThriveParth.",
};

export default function EventsPage() {
  const upcoming = EVENTS.filter((e) => e.upcoming);
  const past = EVENTS.filter((e) => !e.upcoming);

  return (
    <>
      <PageHero
        title="Community Events"
        description="ThriveParth hosts workshops, networking sessions, community events, and educational experiences designed to encourage growth, connection, and opportunity."
        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1920"
      />

      <Section variant="white">
        <SectionHeader eyebrow="Upcoming Events" title="Join us at our next gathering" />
        <div className="grid md:grid-cols-2 gap-8">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Past Highlights" title="Events that brought our community together" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {past.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>
    </>
  );
}
