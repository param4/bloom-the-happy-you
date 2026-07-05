import type { DateKey } from '@/lib/dates';

export type MoodKey = 'joyful' | 'content' | 'okay' | 'low';

/** Moods that trigger the "lift me up" resurfacing flow. */
export const LOW_MOODS: readonly MoodKey[] = ['low', 'okay'];

export interface MoodLog {
  dateKey: DateKey;
  mood: MoodKey;
}
