import type { DateKey } from '@/lib/dates';

/** The kind streak: showing up counts, and grace days mean nothing breaks. */
export interface StreakState {
  count: number;
  graceDays: number;
  lastActiveDateKey: DateKey | null;
}
