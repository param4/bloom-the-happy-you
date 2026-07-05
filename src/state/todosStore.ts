import { create } from 'zustand';

import type { Todo } from '@/domain/todo';
import { newId } from '@/lib/ids';
import { todayKey } from '@/lib/dates';
import { getContainer, type AppServices } from '@/services/container';

interface TodosState {
  todos: Todo[];
  hydrate(): Promise<void>;
  add(text: string): Promise<void>;
  toggle(id: string): Promise<void>;
  remove(id: string): Promise<void>;
}

export const createTodosStore = (services: AppServices) =>
  create<TodosState>()((set, get) => ({
    todos: [],
    async hydrate() {
      set({ todos: await services.todos.getAll() });
    },
    async add(text) {
      const todo: Todo = { id: newId(), text, done: false, dateKey: todayKey() };
      await services.todos.add(todo);
      set({ todos: [...get().todos, todo] });
    },
    async toggle(id) {
      const current = get().todos.find((t) => t.id === id);
      if (!current) return;
      const updated = { ...current, done: !current.done };
      await services.todos.update(updated);
      set({ todos: get().todos.map((t) => (t.id === id ? updated : t)) });
    },
    async remove(id) {
      await services.todos.remove(id);
      set({ todos: get().todos.filter((t) => t.id !== id) });
    },
  }));

export const useTodosStore = createTodosStore(getContainer());
