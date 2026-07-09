import type { StreakState } from './streak';
import { DEFAULT_THEME_KEY, type ThemeKey } from './theme';

export interface ReminderTime {
  hour: number;
  minute: number;
}

export interface Settings {
  reminderTime: ReminderTime | null;
  /** Scheduled notification id — cancelled before rescheduling. */
  reminderNotificationId: string | null;
  streak: StreakState;
  /** Selected accent theme (chosen during onboarding, changeable in settings). */
  theme: ThemeKey;
  /**
   * Most-recently-shown manifestation-moment dream ids, most recent first.
   * Drives the recency penalty in MomentService so the same dream doesn't
   * keep resurfacing. Capped to the recency window.
   */
  recentDreamIds: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  reminderTime: { hour: 8, minute: 0 },
  reminderNotificationId: null,
  streak: { count: 0, graceDays: 2, lastActiveDateKey: null },
  theme: DEFAULT_THEME_KEY,
  recentDreamIds: [],
};
