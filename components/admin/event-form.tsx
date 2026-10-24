"use client";

import { useActionState, useEffect, useMemo, useRef, useState, startTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EventRecord, EventSchedule } from "@/lib/events/types";
import { NTH_OPTIONS, WEEKDAY_OPTIONS, torontoTodayIso } from "@/lib/events/recurrence";
import { Button } from "@/components/ui/button";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/r2/constants";
import {
  createEventAction,
  getEventImageUploadUrlAction,
  updateEventAction,
  type EventActionState,
} from "@/app/admin/events-actions";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  event?: EventRecord;
  onDone?: () => void;
};

const initialState: EventActionState = {};

const fieldClass =
  "w-full rounded-lg border border-forest/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-shadow";

const labelClass = "block text-sm font-semibold text-foreground mb-2";

type ScheduleMode = "once" | "weekly" | "monthly_weekday";
type ImageSource = "url" | "upload";

function isPreviewableUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function scheduleModeFrom(schedule?: EventSchedule): ScheduleMode {
  if (!schedule || schedule.type === "once") return "once";
  return schedule.type;
}

export function EventForm({ mode, event, onDone }: Props) {
  const router = useRouter();
  const action = mode === "create" ? createEventAction : updateEventAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>(scheduleModeFrom(event?.schedule));
  const [date, setDate] = useState(event?.date ?? "");
  const [pastConfirmed, setPastConfirmed] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource>(event?.imageKey ? "upload" : "url");
  const [imageUrl, setImageUrl] = useState(event?.imageKey ? "" : (event?.image ?? ""));
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageKeyRef = useRef<HTMLInputElement>(null);
  const wasPending = useRef(false);

  const today = useMemo(() => torontoTodayIso(), []);
  const isPastDate = scheduleMode === "once" && Boolean(date && date < today);

  useEffect(() => {
    setPastConfirmed(false);
  }, [date, scheduleMode]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (wasPending.current && !pending) setUploading(false);
    wasPending.current = pending;
  }, [pending]);

  useEffect(() => {
    if (state.ok) {
      onDone?.();
      router.refresh();
    }
  }, [state.ok, onDone, router]);

  const saveDisabled = pending || uploading || (isPastDate && !pastConfirmed);
  const shownPreview =
    imageSource === "upload"
      ? previewUrl || (event?.imageKey ? event.image : "")
      : isPreviewableUrl(imageUrl)
        ? imageUrl
        : "";

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    if (imageSource !== "upload") return;
    if (!file) {
      if (!event?.imageKey) {
        formEvent.preventDefault();
        setUploadError("Choose an image to upload, or switch to an image URL.");
      }
      return;
    }

    formEvent.preventDefault();
    const form = formEvent.currentTarget;
    const selected = file;
    setUploadError(null);
    setUploading(true);

    void (async () => {
      try {
        if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(selected.type)) {
          throw new Error("Use a JPEG, PNG, or WebP image.");
        }
        if (selected.size > MAX_UPLOAD_BYTES) {
          throw new Error("Image must be 20MB or smaller.");
        }

        const prepared = await getEventImageUploadUrlAction({
          contentType: selected.type,
          contentLength: selected.size,
        });
        if ("error" in prepared) throw new Error(prepared.error);

        let putRes: Response;
        try {
          putRes = await fetch(prepared.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": selected.type },
            body: selected,
          });
        } catch {
          throw new Error(
            "Could not reach storage. Check that bucket CORS allows uploads from this site.",
          );
        }
        if (!putRes.ok) {
          const detail = (await putRes.text().catch(() => "")).slice(0, 160);
          throw new Error(
            detail
              ? `Upload failed (${putRes.status}): ${detail}`
              : `Upload failed (${putRes.status}).`,
          );
        }

        if (imageKeyRef.current) imageKeyRef.current.value = prepared.key;
        const data = new FormData(form);
        data.set("imageSource", "upload");
        data.set("imageKey", prepared.key);
        data.delete("image");
        startTransition(() => {
          formAction(data);
        });
      } catch (error) {
        setUploading(false);
        setUploadError(error instanceof Error ? error.message : "Upload failed.");
      }
    })();
  }
  const recurring = scheduleMode !== "once";
  const existingRecurring = event?.schedule && event.schedule.type !== "once" ? event.schedule : null;

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      {mode === "edit" && event && <input type="hidden" name="id" value={event.id} />}

      <div>
        <label htmlFor={`${mode}-title`} className={labelClass}>
          Title
        </label>
        <input
          id={`${mode}-title`}
          name="title"
          required
          defaultValue={event?.title}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={`${mode}-description`} className={labelClass}>
          Description
        </label>
        <textarea
          id={`${mode}-description`}
          name="description"
          required
          rows={4}
          defaultValue={event?.description}
          className={`${fieldClass} resize-y min-h-[100px]`}
        />
      </div>

      <div>
        <span className={labelClass}>Schedule</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(
            [
              { value: "once", label: "One-time" },
              { value: "weekly", label: "Every week" },
              { value: "monthly_weekday", label: "Monthly (e.g. 2nd Sat)" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                scheduleMode === option.value
                  ? "border-forest bg-forest/5 text-forest font-semibold"
                  : "border-forest/15 bg-white text-muted hover:border-forest/30"
              }`}
            >
              <input
                type="radio"
                name="scheduleType"
                value={option.value}
                checked={scheduleMode === option.value}
                onChange={() => setScheduleMode(option.value)}
                className="accent-forest"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {scheduleMode === "once" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${mode}-date`} className={labelClass}>
              Date
            </label>
            <input
              id={`${mode}-date`}
              name="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`${mode}-time`} className={labelClass}>
              Time
            </label>
            <input
              id={`${mode}-time`}
              name="time"
              required
              defaultValue={event?.time}
              placeholder="10:00 AM – 1:00 PM"
              className={fieldClass}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-forest/10 bg-beige/40 p-4">
          <p className="text-sm text-muted">
            Visitors see the <span className="font-semibold text-foreground">next upcoming date</span>{" "}
            plus a recurring label (for example, “Every 2nd Saturday”).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${mode}-weekday`} className={labelClass}>
                Weekday
              </label>
              <select
                id={`${mode}-weekday`}
                name="weekday"
                required
                defaultValue={existingRecurring?.weekday ?? 6}
                className={fieldClass}
              >
                {WEEKDAY_OPTIONS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {scheduleMode === "monthly_weekday" && (
              <div>
                <label htmlFor={`${mode}-nth`} className={labelClass}>
                  Which week
                </label>
                <select
                  id={`${mode}-nth`}
                  name="nth"
                  required
                  defaultValue={
                    existingRecurring && existingRecurring.type === "monthly_weekday"
                      ? existingRecurring.nth
                      : 2
                  }
                  className={fieldClass}
                >
                  {NTH_OPTIONS.map((nth) => (
                    <option key={nth.value} value={nth.value}>
                      {nth.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor={`${mode}-time-recurring`} className={labelClass}>
                Time
              </label>
              <input
                id={`${mode}-time-recurring`}
                name="time"
                required
                defaultValue={event?.time}
                placeholder="10:00 AM – 1:00 PM"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`${mode}-startDate`} className={labelClass}>
                Starts on <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id={`${mode}-startDate`}
                name="startDate"
                type="date"
                defaultValue={event?.date && recurring ? event.date : ""}
                className={fieldClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${mode}-endDate`} className={labelClass}>
                Ends on <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id={`${mode}-endDate`}
                name="endDate"
                type="date"
                defaultValue={existingRecurring?.endDate ?? ""}
                className={fieldClass}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${mode}-location`} className={labelClass}>
          Location
        </label>
        <input
          id={`${mode}-location`}
          name="location"
          required
          defaultValue={event?.location}
          className={fieldClass}
        />
      </div>

      <div>
        <span className={labelClass}>Image</span>
        <p className="text-sm text-muted mb-3">
          Use an image URL or upload a file. An event keeps only the option you select.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {(
            [
              { value: "url", label: "Image URL" },
              { value: "upload", label: "Upload image" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                imageSource === option.value
                  ? "border-forest bg-forest/5 text-forest font-semibold"
                  : "border-forest/15 bg-white text-muted hover:border-forest/30"
              }`}
            >
              <input
                type="radio"
                name="imageSource"
                value={option.value}
                checked={imageSource === option.value}
                onChange={() => {
                  setImageSource(option.value);
                  setUploadError(null);
                  if (option.value === "url") setFile(null);
                }}
                className="accent-forest"
              />
              {option.label}
            </label>
          ))}
        </div>

        {imageSource === "url" ? (
          <div key="image-url">
            <label htmlFor={`${mode}-image`} className={labelClass}>
              Image URL
            </label>
            <input
              id={`${mode}-image`}
              name="image"
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://"
              className={fieldClass}
            />
          </div>
        ) : (
          <div key="image-upload">
            <label htmlFor={`${mode}-file`} className={labelClass}>
              Image file
            </label>
            <input
              id={`${mode}-file`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={!event?.imageKey}
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setUploadError(null);
              }}
              className="block w-full text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-forest file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-forest/90"
            />
            <input ref={imageKeyRef} type="hidden" name="imageKey" defaultValue={event?.imageKey ?? ""} />
            <p className="text-xs text-muted mt-2">
              JPEG, PNG, or WebP, up to 20MB.
              {event?.imageKey ? " Leave this empty to keep the current image." : ""}
            </p>
          </div>
        )}

        {shownPreview && (
          <div className="mt-3 relative h-36 w-full max-w-xs overflow-hidden rounded-lg border border-forest/10 bg-beige">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shownPreview} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        )}

        {uploading && <p className="text-sm text-muted mt-3">Uploading image…</p>}
        {uploadError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-3">
            {uploadError}
          </p>
        )}
      </div>

      {isPastDate && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 space-y-3">
          <p className="text-sm text-amber-900">
            This date is in the past. Saving will move the event to Past Events.
          </p>
          <label className="flex items-start gap-3 text-sm text-amber-900 cursor-pointer">
            <input
              type="checkbox"
              checked={pastConfirmed}
              onChange={(e) => setPastConfirmed(e.target.checked)}
              className="mt-1 rounded border-amber-400"
            />
            <span>I understand and want to save this past date.</span>
          </label>
        </div>
      )}

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" variant="primary" size="sm" disabled={saveDisabled} loading={pending || uploading}>
          {mode === "create" ? "Create event" : "Save changes"}
        </Button>
        {onDone && (
          <Button type="button" variant="outline" size="sm" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
