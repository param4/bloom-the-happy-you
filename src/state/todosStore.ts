import { create } from 'zustand';

import type { Todo } from '@/domain/todo';
import { newId } from '@/lib/ids';
import { todayKey, type DateKey } from '@/lib/dates';
import { getContainer, type AppServices } from '@/services/container';

/**
 * The undone todos from the most recent day *before* `today` that has any
 * todos. Date keys sort lexicographically in chronological order, so the last
 * prior key is the latest previous day. Used to carry unfinished tasks forward.
 */
export function pendingFromLastDay(all: Todo[], today: DateKey): Todo[] {
  const priorDays = [...new Set(all.filter((t) => t.dateKey < today).map((t) => t.dateKey))].sort();
  const last = priorDays[priorDays.length - 1];
  if (!last) return [];
  return all.filter((t) => t.dateKey === last && !t.done);
}

interface TodosState {
  /** Full history across every day; screens filter by the day they show. */
  all: Todo[];
  hydrate(): Promise<void>;
  add(text: string): Promise<void>;
  toggle(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  /**
   * Copy last day's unfinished tasks into today (skipping any whose text is
   * already on today's list). Returns how many were carried over.
   */
  inheritPending(): Promise<number>;
}

export const createTodosStore = (services: AppServices) =>
  create<TodosState>()((set, get) => ({
    all: [],
    async hydrate() {
      set({ all: await services.todos.getAll() });
    },
    async add(text) {
      const todo: Todo = { id: newId(), text, done: false, dateKey: todayKey() };
      await services.todos.add(todo);
      set({ all: [...get().all, todo] });
    },
    async toggle(id) {
      const current = get().all.find((t) => t.id === id);
      if (!current) return;
      const updated = { ...current, done: !current.done };
      await services.todos.update(updated);
      set({ all: get().all.map((t) => (t.id === id ? updated : t)) });
    },
    async remove(id) {
      await services.todos.remove(id);
      set({ all: get().all.filter((t) => t.id !== id) });
    },
    async inheritPending() {
      const today = todayKey();
      const all = get().all;
      const existingToday = new Set(
        all.filter((t) => t.dateKey === today).map((t) => t.text),
      );
      const carried: Todo[] = pendingFromLastDay(all, today)
        .filter((t) => !existingToday.has(t.text))
        .map((t) => ({ id: newId(), text: t.text, done: false, dateKey: today }));
      for (const todo of carried) await services.todos.add(todo);
      if (carried.length) set({ all: [...all, ...carried] });
      return carried.length;
    },
  }));

export const useTodosStore = createTodosStore(getContainer());
