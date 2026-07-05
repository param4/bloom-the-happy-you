import type { DateKey } from '@/lib/dates';

/** A Joy Booth clip (or a placeholder "joy note" when no camera was available). */
export interface JoyVideo {
  id: string;
  dateKey: DateKey;
  label: string;
  mood: 'joyful' | 'content';
  /** Durable file URI of the recording; absent for joy notes. */
  uri?: string;
}
