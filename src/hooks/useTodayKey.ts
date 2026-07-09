import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { todayKey, type DateKey } from '@/lib/dates';

/**
 * The current LOCAL date key, kept live so date-scoped lists (e.g. today's
 * todos) refresh on their own: it flips at local midnight — the moment a new
 * day's empty list should appear — and also re-checks whenever the app returns
 * to the foreground (covering time asleep across midnight).
 */
export function useTodayKey(): DateKey {
  const [key, setKey] = useState<DateKey>(() => todayKey());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleMidnight = () => {
      const now = new Date();
      // A hair past midnight so the local calendar has definitely rolled over.
      const next = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        500,
      );
      timer = setTimeout(() => {
        setKey(todayKey());
        scheduleMidnight();
      }, next.getTime() - now.getTime());
    };

    scheduleMidnight();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setKey(todayKey());
    });

    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return key;
}
