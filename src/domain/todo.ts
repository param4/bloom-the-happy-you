import type { DateKey } from '@/lib/dates';

/** One item on today's gentle list. */
export interface Todo {
  id: string;
  text: string;
  done: boolean;
  dateKey: DateKey;
}
