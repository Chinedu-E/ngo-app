import Image from "next/image";
import { Calendar, Clock, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventWithStatus } from "@/lib/events/types";

export default function EventCard({ event }: { event: EventWithStatus }) {
  return (
    <article className="bg-white rounded-2xl border border-forest/10 overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-48">
        <Image src={event.image} alt={event.title} fill className="object-cover" sizes="400px" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {!event.upcoming && (
            <span className="px-3 py-1 rounded-full bg-forest/90 text-white text-xs font-bold uppercase tracking-wider">
              Past Event
            </span>
          )}
          {event.recurring && event.upcoming && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-white text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="h-3 w-3" />
              Recurring
            </span>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-forest font-semibold mb-2">{event.title}</h3>
        <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{event.description}</p>
        <ul className="space-y-2 text-sm text-foreground mb-6">
          <li className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-sage shrink-0 mt-0.5" />
            <span>
              {event.recurring ? (
                <>
                  <span className="font-medium">Next: {event.displayDate}</span>
                  {event.recurrenceLabel && (
                    <span className="block text-muted text-xs mt-0.5">{event.recurrenceLabel}</span>
                  )}
                </>
              ) : (
                event.displayDate
              )}
            </span>
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
