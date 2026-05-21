import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  upcoming: boolean;
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <article className="bg-white rounded-2xl border border-forest/10 overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-48">
        <Image src={event.image} alt={event.title} fill className="object-cover" sizes="400px" />
        {!event.upcoming && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-forest/90 text-white text-xs font-bold uppercase tracking-wider">
            Past Event
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-forest font-semibold mb-2">{event.title}</h3>
        <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{event.description}</p>
        <ul className="space-y-2 text-sm text-foreground mb-6">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sage shrink-0" />
            {event.date}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sage shrink-0" />
            {event.time}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sage shrink-0" />
            {event.location}
          </li>
        </ul>
        {event.upcoming ? (
          <Button href="/contact" variant="primary" size="sm" className="w-full">
            Register Interest
          </Button>
        ) : (
          <span className="text-center text-sm text-muted py-3">Event completed</span>
        )}
      </div>
    </article>
  );
}
