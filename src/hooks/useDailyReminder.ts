import { useCallback, useEffect, useState } from 'react';

import type { ReminderTime } from '@/domain/settings';
import { useServices } from '@/providers/ServicesProvider';

/**
 * Binds the vision-board reminder row to settings + notifications:
 * asks permission contextually (on interaction, not at launch) and always
 * cancels the previous schedule before creating a new one.
 */
export function useDailyReminder() {
  const { settings, notifications } = useServices();
  const [time, setTime] = useState<ReminderTime | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    settings.get().then((s) => {
      if (!cancelled) setTime(s.reminderTime);
    });
    return () => {
      cancelled = true;
    };
  }, [settings]);

  const updateTime = useCallback(
    async (next: ReminderTime) => {
      setTime(next); // optimistic — the row reflects the choice immediately
      const current = await settings.get();

      if (current.reminderNotificationId) {
        await notifications.cancel(current.reminderNotificationId);
      }

      const granted = await notifications.requestPermission();
      setPermissionDenied(!granted);
      const reminderNotificationId = granted
        ? await notifications.scheduleDaily(next)
        : null;

      await settings.update((s) => ({ ...s, reminderTime: next, reminderNotificationId }));
    },
    [settings, notifications],
  );

  return { time, updateTime, permissionDenied };
}
