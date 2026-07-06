export const HUB_TIME_ZONE = "America/Santiago";

/** Format a date as YYYY-MM-DD in local time (avoids UTC shift from toISOString). */
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Format a date as YYYY-MM-DD in the hub timezone (Santiago, GMT-4 in winter). */
export function formatHubDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HUB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

/** Parse a YYYY-MM-DD string as local midnight. */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Today's date in the hub timezone, represented as a date-only local midnight. */
export function getHubToday(now = new Date()): Date {
  return parseLocalDate(formatHubDate(now));
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Sunday 00:00 of the week containing `date` (Sun–Sat weeks) */
export function getWeekStart(date: Date): Date {
  const d = startOfLocalDay(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

/** Saturday 00:00 of the week containing `date` */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

export function isSameWeek(a: Date, b: Date): boolean {
  return formatLocalDate(getWeekStart(a)) === formatLocalDate(getWeekStart(b));
}

export function isCurrentWeek(date: Date, now = new Date()): boolean {
  const d = startOfLocalDay(date);
  const start = getWeekStart(now);
  const end = getWeekEnd(now);
  return d >= start && d <= end;
}

/** Bookings/passes on or after today */
export function isUpcomingOrToday(dateStr: string, now = new Date()): boolean {
  const d = parseLocalDate(dateStr);
  const today = startOfLocalDay(now);
  return d >= today;
}
