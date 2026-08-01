export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toKey(new Date());
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

export function diffDays(from: string, to: string): number {
  const a = fromKey(from).getTime();
  const b = fromKey(to).getTime();
  return Math.round((b - a) / 86400000);
}

/** 1-based day number inside the challenge, clamped to >= 1 */
export function dayNumber(startDate: string, key: string): number {
  return Math.max(1, diffDays(startDate, key) + 1);
}

/** Keys for the last `n` days, oldest first, ending on `end` (default today). */
export function lastNDays(n: number, end: string = todayKey()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(end, -i));
  return out;
}

export function rangeFrom(start: string, count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(addDays(start, i));
  return out;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function weekdayShort(key: string): string {
  return WEEKDAYS[fromKey(key).getDay()];
}

export function monthShort(key: string): string {
  return MONTHS[fromKey(key).getMonth()];
}

export function prettyDate(key: string): string {
  const d = fromKey(key);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function isFuture(key: string): boolean {
  return diffDays(todayKey(), key) > 0;
}
