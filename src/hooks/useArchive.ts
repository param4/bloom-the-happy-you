import { useMemo } from 'react';

import type { Entry } from '@/domain/entry';
import { daysBetween, parseDateKey, todayKey } from '@/lib/dates';

export interface ArchiveGroups {
  /** Entries from the last 5 days (newest first). */
  recent: Entry[];
  /** Older entries grouped year → month (month index 0–11). */
  years: Record<number, Record<number, Entry[]>>;
}

/** Splits pillar entries into "the last few days" and a year→month archive. */
export function useArchive(entries: Entry[]): ArchiveGroups {
  return useMemo(() => {
    const today = todayKey();
    const isRecent = (e: Entry) => e.dateKey === today || daysBetween(e.dateKey) <= 5;

    const recent = entries
      .filter(isRecent)
      .sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));

    const years: ArchiveGroups['years'] = {};
    for (const e of entries.filter((e) => !isRecent(e))) {
      const d = parseDateKey(e.dateKey);
      const y = d.getFullYear();
      const m = d.getMonth();
      (years[y] ??= {})[m] ??= [];
      years[y][m].push(e);
    }
    return { recent, years };
  }, [entries]);
}
