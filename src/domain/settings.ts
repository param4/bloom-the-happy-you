import type { StreakState } from './streak';

export interface ReminderTime {
  hour: number;
  minute: number;
}

export interface Settings {
  reminderTime: ReminderTime | null;
  /** Scheduled notification id — cancelled before rescheduling. */
  reminderNotificationId: string | null;
  streak: StreakState;
}

export const DEFAULT_SETTINGS: Settings = {
  reminderTime: { hour: 8, minute: 0 },
  reminderNotificationId: null,
  streak: { count: 0, graceDays: 2, lastActiveDateKey: null },
};
