"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { torontoTodayIso } from "@/lib/events/recurrence";
import { createUniqueId, readEvents, writeEvents } from "@/lib/events/store";
import type {
  EventRecord,
  EventSchedule,
  MonthWeekOrdinal,
  Weekday,
} from "@/lib/events/types";

export type EventActionState = {
  ok?: boolean;
  error?: string;
};

function parseWeekday(value: string): Weekday | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > 6) return null;
  return n as Weekday;
}

function parseNth(value: string): MonthWeekOrdinal | null {
  const n = Number(value);
  if (n === 1 || n === 2 || n === 3 || n === 4 || n === -1) return n;
  return null;
}

function parseEventFields(formData: FormData): Omit<EventRecord, "id"> | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const scheduleType = String(formData.get("scheduleType") ?? "once").trim();

  if (!title || !description || !time || !location || !image) {
    return { error: "All fields are required." };
  }

  let schedule: EventSchedule;
  let date: string;

  if (scheduleType === "once") {
    date = String(formData.get("date") ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { error: "Date must be a valid calendar date." };
    }
    schedule = { type: "once" };
  } else if (scheduleType === "weekly" || scheduleType === "monthly_weekday") {
    const weekday = parseWeekday(String(formData.get("weekday") ?? ""));
    if (weekday == null) return { error: "Choose a weekday." };

    const startDate = String(formData.get("startDate") ?? "").trim();
    const endDate = String(formData.get("endDate") ?? "").trim();

    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return { error: "Start date must be a valid calendar date." };
    }
    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return { error: "End date must be a valid calendar date." };
    }
    date = startDate || torontoTodayIso();

    if (scheduleType === "weekly") {
      schedule = {
        type: "weekly",
        weekday,
        ...(endDate ? { endDate } : {}),
      };
    } else {
      const nth = parseNth(String(formData.get("nth") ?? ""));
      if (nth == null) return { error: "Choose which week of the month." };
      schedule = {
        type: "monthly_weekday",
        weekday,
        nth,
        ...(endDate ? { endDate } : {}),
      };
    }
  } else {
    return { error: "Invalid schedule type." };
  }

  return { title, description, date, time, location, image, schedule };
}

function revalidateEvents(): void {
  revalidatePath("/events");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function createEventAction(
  _prev: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const fields = parseEventFields(formData);
  if ("error" in fields) return fields;

  const events = await readEvents();
  const event: EventRecord = {
    id: createUniqueId(fields.title, events),
    ...fields,
  };
  events.push(event);
  await writeEvents(events);
  revalidateEvents();
  return { ok: true };
}

export async function updateEventAction(
  _prev: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing event id." };

  const fields = parseEventFields(formData);
  if ("error" in fields) return fields;

  const events = await readEvents();
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return { error: "Event not found." };

  events[index] = { id, ...fields };
  await writeEvents(events);
  revalidateEvents();
  return { ok: true };
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    return;
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const events = await readEvents();
  const next = events.filter((event) => event.id !== id);
  if (next.length === events.length) return;

  await writeEvents(next);
  revalidateEvents();
}
