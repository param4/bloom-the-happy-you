import type { DateKey } from '@/lib/dates';

/** The two journaling pillars. */
export type EntryKind = 'gratitude' | 'appreciation';

/** A single journal entry — written text or a recorded reflection. */
export interface Entry {
  id: string;
  dateKey: DateKey;
  type: 'text' | 'video';
  content: string;
  /** Marked joyful entries are candidates for "lift me up" resurfacing. */
  joyful: boolean;
  /** Durable file URI when type === 'video'. */
  videoUri?: string;
}
