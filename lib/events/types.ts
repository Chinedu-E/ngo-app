/** 0 = Sunday … 6 = Saturday (JS Date convention) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 1–4 = first–fourth; -1 = last in the month */
export type MonthWeekOrdinal = 1 | 2 | 3 | 4 | -1;

export type EventSchedule =
  | { type: "once" }
  | {
      type: "weekly";
      weekday: Weekday;
      /** Optional ISO date after which the series ends */
      endDate?: string;
    }
  | {
      type: "monthly_weekday";
      weekday: Weekday;
      nth: MonthWeekOrdinal;
      endDate?: string;
    };

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  /**
   * For one-time events: the event date.
   * For recurring events: optional series start (defaults to today when computing).
   */
  date: string;
  time: string;
  location: string;
  /** Public image URL. External link, or the public URL of an uploaded file. */
  image: string;
  /** R2 object key when `image` was uploaded. Omitted for external URLs. */
  imageKey?: string;
  /** Omitted / missing on older records → treated as one-time */
  schedule?: EventSchedule;
};

export type EventWithStatus = EventRecord & {
  upcoming: boolean;
  recurring: boolean;
  /** Next (or only) occurrence as YYYY-MM-DD */
  nextDate: string;
  /** Formatted next date, e.g. "Saturday, June 14, 2026" */
  displayDate: string;
  /** Human schedule, e.g. "Every 2nd Saturday" — empty for one-time */
  recurrenceLabel: string;
};
