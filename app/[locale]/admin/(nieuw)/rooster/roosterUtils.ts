/**
 * Week start (maandag) en formattering voor rooster.
 */
export function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(weekStart.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function formatWeekRange(weekStart: Date, locale: string): string {
  const end = new Date(weekStart);
  end.setDate(weekStart.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  return `${weekStart.toLocaleDateString(locale, opts)} – ${end.toLocaleDateString(locale, opts)}`;
}

export function addWeeks(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n * 7);
  return out;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
