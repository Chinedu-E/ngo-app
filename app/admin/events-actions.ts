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
import {
  createPresignedUploadUrl,
  deleteR2Object,
  extensionForMime,
  isAllowedImageType,
  MAX_UPLOAD_BYTES,
  publicUrlForKey,
  type AllowedImageType,
} from "@/lib/r2/client";

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

type ParsedEventFields = Omit<EventRecord, "id"> & { replacedKey?: string };

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Keys minted by getEventImageUploadUrlAction. */
function isEventImageKey(key: string): boolean {
  return /^events\/evt-[a-z0-9]+-[a-z0-9]+\.(jpg|png|webp)$/.test(key);
}

function createEventImageId(): string {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseImageFields(
  formData: FormData,
  previous: EventRecord | undefined,
  events: EventRecord[],
): { image: string; imageKey?: string; replacedKey?: string } | { error: string } {
  const source = String(formData.get("imageSource") ?? "").trim();
  const imageUrl = String(formData.get("image") ?? "").trim();
  const imageKey = String(formData.get("imageKey") ?? "").trim();

  if (imageUrl && imageKey) {
    return { error: "Use an image URL or an uploaded image, not both." };
  }

  if (source === "url") {
    if (!isHttpUrl(imageUrl)) return { error: "Enter a valid image URL." };
    return {
      image: imageUrl,
      ...(previous?.imageKey ? { replacedKey: previous.imageKey } : {}),
    };
  }

  if (source === "upload") {
    if (!imageKey || !isEventImageKey(imageKey)) {
      return { error: "Upload an image, or switch to an image URL." };
    }
    const taken = events.some((event) => event.imageKey === imageKey && event.id !== previous?.id);
    if (taken) return { error: "That uploaded image is already used by another event." };

    if (previous?.imageKey === imageKey) {
      return { image: previous.image, imageKey };
    }

    let image: string;
    try {
      image = publicUrlForKey(imageKey);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Image storage is not configured.",
      };
    }
    return {
      image,
      imageKey,
      ...(previous?.imageKey ? { replacedKey: previous.imageKey } : {}),
    };
  }

  return { error: "Choose an image URL or upload an image." };
}

function parseEventFields(
  formData: FormData,
  previous: EventRecord | undefined,
  events: EventRecord[],
): ParsedEventFields | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const scheduleType = String(formData.get("scheduleType") ?? "once").trim();

  if (!title || !description || !time || !location) {
    return { error: "Title, description, time, and location are required." };
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

  const imageFields = parseImageFields(formData, previous, events);
  if ("error" in imageFields) return imageFields;

  return { title, description, date, time, location, schedule, ...imageFields };
}

function eventRecord(fields: ParsedEventFields): Omit<EventRecord, "id"> {
  const { replacedKey: _replacedKey, ...record } = fields;
  return record;
}

async function deleteUploadedImage(key: string | undefined): Promise<void> {
  if (!key) return;
  try {
    await deleteR2Object(key);
  } catch {
    // Event metadata is already saved.
  }
}

export async function getEventImageUploadUrlAction(input: {
  contentType: string;
  contentLength: number;
}): Promise<{ uploadUrl: string; key: string } | { error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  if (!isAllowedImageType(input.contentType)) {
    return { error: "Only JPEG, PNG, and WebP images are allowed." };
  }
  if (input.contentLength <= 0 || input.contentLength > MAX_UPLOAD_BYTES) {
    return { error: "Image must be 20MB or smaller." };
  }

  const ext = extensionForMime(input.contentType as AllowedImageType);
  const key = `events/${createEventImageId()}.${ext}`;

  try {
    const uploadUrl = await createPresignedUploadUrl({
      key,
      contentType: input.contentType,
      contentLength: input.contentLength,
    });
    return { uploadUrl, key };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to prepare upload.",
    };
  }
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

  try {
    const events = await readEvents();
    const fields = parseEventFields(formData, undefined, events);
    if ("error" in fields) return fields;

    const event: EventRecord = {
      id: createUniqueId(fields.title, events),
      ...eventRecord(fields),
    };
    events.push(event);
    await writeEvents(events);
    revalidateEvents();
    return { ok: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not save event. Check R2 credentials on the host.",
    };
  }
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

  try {
    const events = await readEvents();
    const index = events.findIndex((event) => event.id === id);
    if (index === -1) return { error: "Event not found." };

    const fields = parseEventFields(formData, events[index], events);
    if ("error" in fields) return fields;

    events[index] = { id, ...eventRecord(fields) };
    await writeEvents(events);
    await deleteUploadedImage(fields.replacedKey);
    revalidateEvents();
    return { ok: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not save event. Check R2 credentials on the host.",
    };
  }
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
  const removed = events.find((event) => event.id === id);
  const next = events.filter((event) => event.id !== id);
  if (next.length === events.length) return;

  await writeEvents(next);
  await deleteUploadedImage(removed?.imageKey);
  revalidateEvents();
}
