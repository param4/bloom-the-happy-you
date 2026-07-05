import type { DateKey } from '@/lib/dates';

/** The two journaling pillars. */
export type EntryKind = 'gratitude' | 'appreciation';

/** How an entry was captured. */
export type EntryType = 'text' | 'voice' | 'video';

/** A single journal entry — written text, a voice note, or a video reflection. */
export interface Entry {
  id: string;
  dateKey: DateKey;
  type: EntryType;
  content: string;
  /** Marked joyful entries are candidates for "lift me up" resurfacing. */
  joyful: boolean;
  /** Durable file URI when type === 'video'. */
  videoUri?: string;
  /** Durable file URI when type === 'voice'. */
  audioUri?: string;
}
