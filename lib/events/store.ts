import { promises as fs } from "fs";
import path from "path";
import {
  formatEventDate,
  isEventUpcoming,
  isRecurringSchedule,
  nextOccurrenceDate,
  recurrenceLabel,
  torontoTodayIso,
} from "@/lib/events/recurrence";
import type { EventRecord, EventWithStatus } from "@/lib/events/types";

const EVENTS_PATH = path.join(process.cwd(), "data", "events.json");

export { torontoTodayIso, formatEventDate, isEventUpcoming };

export function isUpcomingDate(isoDate: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return false;
  return isoDate >= torontoTodayIso(now);
}

export function withEventStatus(event: EventRecord, now = new Date()): EventWithStatus {
  const today = torontoTodayIso(now);
  const nextDate = nextOccurrenceDate(event, today);
  const recurring = isRecurringSchedule(event.schedule);

  return {
    ...event,
    upcoming: isEventUpcoming(event, now),
    recurring,
    nextDate,
    displayDate: formatEventDate(nextDate),
    recurrenceLabel: recurrenceLabel(event.schedule),
  };
}

export async function readEvents(): Promise<EventRecord[]> {
  const raw = await fs.readFile(EVENTS_PATH, "utf8");
  const parsed = JSON.parse(raw) as EventRecord[];
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid events data.");
  }
  return parsed;
}

export async function writeEvents(events: EventRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(EVENTS_PATH), { recursive: true });
  await fs.writeFile(EVENTS_PATH, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

export async function getEventsWithStatus(now = new Date()): Promise<EventWithStatus[]> {
  const events = await readEvents();
  return events
    .map((event) => withEventStatus(event, now))
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate));
}

export async function getEventById(id: string): Promise<EventRecord | undefined> {
  const events = await readEvents();
  return events.find((event) => event.id === id);
}

export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "event";
}

export function createUniqueId(title: string, existing: EventRecord[]): string {
  const base = slugifyTitle(title);
  if (!existing.some((e) => e.id === base)) return base;
  let i = 2;
  while (existing.some((e) => e.id === `${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}
