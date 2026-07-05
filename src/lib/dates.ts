/**
 * Date helpers built on LOCAL calendar dates.
 *
 * The prototype used `toISOString().slice(0, 10)`, which is UTC — an entry
 * written before ~5:30am IST would be stamped "yesterday", breaking streaks
 * and "today" checks. All persistence uses these local dateKeys instead.
 */

/** 'YYYY-MM-DD' in the device's local calendar. */
export type DateKey = string;

export const toDateKey = (d: Date): DateKey => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayKey = (): DateKey => toDateKey(new Date());

/**
 * Parse a dateKey to a Date at LOCAL midnight.
 * (`new Date('YYYY-MM-DD')` would parse as UTC midnight — off by one for
 * timezones ahead of UTC.)
 */
export const parseDateKey = (key: DateKey): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const daysAgoKey = (n: number): DateKey => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateKey(d);
};

/** Whole days between a dateKey and today (minimum 1, like the prototype). */
export const daysBetween = (key: DateKey): number => {
  const then = parseDateKey(key).getTime();
  const now = new Date().getTime();
  return Math.max(1, Math.round((now - then) / 86_400_000));
};

/** Calendar-day difference between two dateKeys (b - a). */
export const dayDiff = (a: DateKey, b: DateKey): number =>
  Math.round((parseDateKey(b).getTime() - parseDateKey(a).getTime()) / 86_400_000);

/** e.g. "Sat, Jul 4" */
export const fmtDay = (key: DateKey): string =>
  parseDateKey(key).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;
