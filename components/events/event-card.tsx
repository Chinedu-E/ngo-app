"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventWithStatus } from "@/lib/events/types";

export default function EventCard({ event }: { event: EventWithStatus }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <article className="bg-white rounded-2xl border border-forest/10 overflow-hidden shadow-sm h-[36rem] grid grid-rows-[60%_40%]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative min-h-0 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage/50"
          aria-label={`View details for ${event.title}`}
        >
          <Image
            src={event.image}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <StatusBadges event={event} />
          </div>
        </button>

        <div className="min-h-0 p-4 sm:p-5 flex flex-col gap-2 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="min-h-0 text-left overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 rounded-md"
          >
            <h3 className="font-serif text-lg text-forest font-semibold leading-snug line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed mt-1.5 line-clamp-2">{event.description}</p>
          </button>

          <EventMeta event={event} compact />

          <div className="mt-auto shrink-0 pt-1">
            {event.upcoming ? (
              <Button href="/contact" variant="primary" size="sm" className="w-full">
                Register Interest
              </Button>
            ) : (
              <span className="block text-center text-sm text-muted py-2">Event completed</span>
            )}
          </div>
        </div>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-forest/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-72 bg-beige">
              <Image
                src={event.image}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, 576px"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close event details"
                className="absolute top-3 right-3 rounded-full bg-white/95 text-forest p-2 shadow-sm hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <StatusBadges event={event} />
              </div>
              <h2 id={titleId} className="font-serif text-2xl text-forest font-semibold mb-3">
                {event.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6 whitespace-pre-wrap">
                {event.description}
              </p>
              <EventMeta event={event} />
              <div className="mt-6">
                {event.upcoming ? (
                  <Button href="/contact" variant="primary" size="sm" className="w-full">
                    Register Interest
                  </Button>
                ) : (
                  <span className="block text-center text-sm text-muted py-3">Event completed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadges({ event }: { event: EventWithStatus }) {
  return (
    <>
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
    </>
  );
}

function EventMeta({ event, compact = false }: { event: EventWithStatus; compact?: boolean }) {
  const text = compact ? "text-xs" : "text-sm";
  const icon = compact ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <ul className={`shrink-0 space-y-1.5 ${text} text-foreground`}>
      <li className="flex items-start gap-2 min-w-0">
        <Calendar className={`${icon} text-sage shrink-0 mt-0.5`} />
        <span className="min-w-0">
          {event.recurring ? (
            <>
              <span className={`block truncate ${compact ? "" : "font-medium"}`}>
                Next: {event.displayDate}
              </span>
              {event.recurrenceLabel && (
                <span className="block text-muted text-xs mt-0.5 truncate">{event.recurrenceLabel}</span>
              )}
            </>
          ) : (
            <span className="block truncate">{event.displayDate}</span>
          )}
        </span>
      </li>
      <li className="flex items-center gap-2 min-w-0">
        <Clock className={`${icon} text-sage shrink-0`} />
        <span className="truncate">{event.time}</span>
      </li>
      <li className="flex items-center gap-2 min-w-0">
        <MapPin className={`${icon} text-sage shrink-0`} />
        <span className="truncate">{event.location}</span>
      </li>
    </ul>
  );
}
