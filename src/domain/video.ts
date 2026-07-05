import type { DateKey } from '@/lib/dates';

/** A Joy Booth clip (or a placeholder "joy note" when no camera was available). */
export interface JoyVideo {
  id: string;
  dateKey: DateKey;
  label: string;
  mood: 'joyful' | 'content';
  /** Private by default; sharing is an explicit per-clip choice. */
  shared: boolean;
  /** Placeholder tile color when there is no recording. */
  color: string;
  /** Durable file URI of the recording; absent for joy notes / seed data. */
  uri?: string;
}
