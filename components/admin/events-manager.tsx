"use client";

import { useState } from "react";
import { Calendar, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import type { EventWithStatus } from "@/lib/events/types";
import { EventForm } from "@/components/admin/event-form";
import { Button } from "@/components/ui/button";
import { deleteEventAction } from "@/app/admin/events-actions";

type Props = {
  upcoming: EventWithStatus[];
  past: EventWithStatus[];
};

function EventAdminCard({
  event,
  editingId,
  onEdit,
  onCloseEdit,
}: {
  event: EventWithStatus;
  editingId: string | null;
  onEdit: (id: string) => void;
  onCloseEdit: () => void;
}) {
  const isEditing = editingId === event.id;

  return (
    <article className="rounded-2xl border border-forest/10 bg-white overflow-hidden shadow-sm">
      <div className="p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                event.upcoming
                  ? "bg-forest/10 text-forest"
                  : "bg-muted/10 text-muted"
              }`}
            >
              {event.upcoming ? "Upcoming" : "Past"}
            </span>
            {event.recurring && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sage/15 text-sage">
                Recurring
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg text-forest font-semibold mb-1">{event.title}</h3>
          <p className="text-sm text-muted line-clamp-2 mb-3">{event.description}</p>
          <ul className="space-y-1.5 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <span>
                {event.recurring ? `Next: ${event.displayDate}` : event.displayDate}
                {" · "}
                {event.time}
                {event.recurrenceLabel && (
                  <span className="block text-xs text-muted mt-0.5">{event.recurrenceLabel}</span>
                )}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sage shrink-0" />
              {event.location}
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(event.id)}>
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <form action={deleteEventAction}>
            <input type="hidden" name="id" value={event.id} />
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm(`Delete “${event.title}”?`)) e.preventDefault();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold border border-red-200 text-red-700 bg-white hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </form>
        </div>
      </div>

      {isEditing && (
        <div className="border-t border-forest/10 p-5 bg-beige/50">
          <EventForm mode="edit" event={event} onDone={onCloseEdit} />
        </div>
      )}
    </article>
  );
}

function EventSection({
  title,
  description,
  events,
  editingId,
  onEdit,
  onCloseEdit,
}: {
  title: string;
  description: string;
  events: EventWithStatus[];
  editingId: string | null;
  onEdit: (id: string) => void;
  onCloseEdit: () => void;
}) {
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="font-serif text-xl text-forest font-semibold">{title}</h2>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>
      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-forest/15 bg-white/60 px-6 py-10 text-center text-muted text-sm">
          No events in this list.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventAdminCard
              key={event.id}
              event={event}
              editingId={editingId}
              onEdit={onEdit}
              onCloseEdit={onCloseEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function EventsManager({ upcoming, past }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-forest font-semibold">Events</h1>
          <p className="text-muted text-sm mt-1">
            Create and edit events. Dates in the past appear under Past Events automatically.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => {
            setCreating(true);
            setEditingId(null);
          }}
        >
          <Plus className="w-4 h-4" />
          Add event
        </Button>
      </div>

      {creating && (
        <div className="mb-10 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg text-forest font-semibold mb-4">New event</h2>
          <EventForm mode="create" onDone={() => setCreating(false)} />
        </div>
      )}

      <EventSection
        title="Upcoming Events"
        description="Today or later (America/Toronto)."
        events={upcoming}
        editingId={editingId}
        onEdit={(id) => {
          setEditingId(id);
          setCreating(false);
        }}
        onCloseEdit={() => setEditingId(null)}
      />

      <EventSection
        title="Past Events"
        description="Dates before today move here automatically."
        events={[...past].reverse()}
        editingId={editingId}
        onEdit={(id) => {
          setEditingId(id);
          setCreating(false);
        }}
        onCloseEdit={() => setEditingId(null)}
      />
    </div>
  );
}
