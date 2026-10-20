import type {
  EventRecord,
  EventSchedule,
  MonthWeekOrdinal,
  Weekday,
} from "@/lib/events/types";

const TIMEZONE = "America/Toronto";

export const WEEKDAY_OPTIONS: { value: Weekday; label: string }[] = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const NTH_OPTIONS: { value: MonthWeekOrdinal; label: string }[] = [
  { value: 1, label: "1st" },
  { value: 2, label: "2nd" },
  { value: 3, label: "3rd" },
  { value: 4, label: "4th" },
  { value: -1, label: "Last" },
];

export function torontoTodayIso(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function formatEventDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const utc = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(utc);
}

function isoFromParts(year: number, monthIndex: number, day: number): string {
  const y = String(year);
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseIso(iso: string): { year: number; monthIndex: number; day: number } | null {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, monthIndex: month - 1, day };
}

function addDaysIso(iso: string, days: number): string {
  const parts = parseIso(iso);
  if (!parts) return iso;
  const utc = Date.UTC(parts.year, parts.monthIndex, parts.day + days, 12);
  const d = new Date(utc);
  return isoFromParts(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function weekdayOfIso(iso: string): Weekday {
  const parts = parseIso(iso);
  if (!parts) return 0;
  return new Date(Date.UTC(parts.year, parts.monthIndex, parts.day, 12)).getUTCDay() as Weekday;
}

function weekdayLabel(weekday: Weekday): string {
  return WEEKDAY_OPTIONS.find((o) => o.value === weekday)?.label ?? "Day";
}

function nthLabel(nth: MonthWeekOrdinal): string {
  return NTH_OPTIONS.find((o) => o.value === nth)?.label ?? String(nth);
}

export function normalizeSchedule(schedule?: EventSchedule): EventSchedule {
  if (!schedule || schedule.type === "once") return { type: "once" };
  return schedule;
}

export function isRecurringSchedule(schedule?: EventSchedule): boolean {
  const s = normalizeSchedule(schedule);
  return s.type !== "once";
}

export function recurrenceLabel(schedule?: EventSchedule): string {
  const s = normalizeSchedule(schedule);
  if (s.type === "once") return "";
  if (s.type === "weekly") {
    return `Every ${weekdayLabel(s.weekday)}`;
  }
  return `Every ${nthLabel(s.nth)} ${weekdayLabel(s.weekday)}`;
}

function nthWeekdayInMonth(
  year: number,
  monthIndex: number,
  weekday: Weekday,
  nth: MonthWeekOrdinal,
): string | null {
  if (nth === -1) {
    const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0, 12)).getUTCDate();
    for (let day = lastDay; day >= 1; day -= 1) {
      const iso = isoFromParts(year, monthIndex, day);
      if (weekdayOfIso(iso) === weekday) return iso;
    }
    return null;
  }

  let count = 0;
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0, 12)).getUTCDate();
  for (let day = 1; day <= lastDay; day += 1) {
    const iso = isoFromParts(year, monthIndex, day);
    if (weekdayOfIso(iso) === weekday) {
      count += 1;
      if (count === nth) return iso;
    }
  }
  return null;
}

function nextWeekly(weekday: Weekday, fromIso: string): string {
  const current = weekdayOfIso(fromIso);
  const delta = (weekday - current + 7) % 7;
  return addDaysIso(fromIso, delta);
}

function nextMonthlyWeekday(
  weekday: Weekday,
  nth: MonthWeekOrdinal,
  fromIso: string,
): string {
  const parts = parseIso(fromIso);
  if (!parts) return fromIso;

  for (let offset = 0; offset < 24; offset += 1) {
    const year = parts.year + Math.floor((parts.monthIndex + offset) / 12);
    const monthIndex = (parts.monthIndex + offset) % 12;
    const candidate = nthWeekdayInMonth(year, monthIndex, weekday, nth);
    if (candidate && candidate >= fromIso) return candidate;
  }
  return fromIso;
}

/** Next occurrence on or after `fromIso` (Toronto calendar day). */
export function nextOccurrenceDate(
  event: Pick<EventRecord, "date" | "schedule">,
  fromIso = torontoTodayIso(),
): string {
  const schedule = normalizeSchedule(event.schedule);

  if (schedule.type === "once") {
    return event.date;
  }

  const start = event.date && event.date > fromIso ? event.date : fromIso;
  let next =
    schedule.type === "weekly"
      ? nextWeekly(schedule.weekday, start)
      : nextMonthlyWeekday(schedule.weekday, schedule.nth, start);

  if (schedule.endDate && next > schedule.endDate) {
    return schedule.endDate;
  }
  return next;
}

export function isEventUpcoming(
  event: Pick<EventRecord, "date" | "schedule">,
  now = new Date(),
): boolean {
  const today = torontoTodayIso(now);
  const schedule = normalizeSchedule(event.schedule);

  if (schedule.type === "once") {
    return /^\d{4}-\d{2}-\d{2}$/.test(event.date) && event.date >= today;
  }

  if (schedule.endDate && schedule.endDate < today) {
    return false;
  }

  const next = nextOccurrenceDate(event, today);
  if (schedule.endDate && next > schedule.endDate) {
    return false;
  }
  return next >= today;
}
