import type { Todo } from '@/domain/todo';

import type { ITodoRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageTodoRepository implements ITodoRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async getAll(): Promise<Todo[]> {
    return (await this.kv.get<Todo[]>(storageKeys.todos)) ?? [];
  }

  async add(todo: Todo): Promise<void> {
    const all = await this.getAll();
    await this.kv.set(storageKeys.todos, [...all, todo]);
  }

  async update(todo: Todo): Promise<void> {
    const all = await this.getAll();
    await this.kv.set(
      storageKeys.todos,
      all.map((t) => (t.id === todo.id ? todo : t)),
    );
  }

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await this.kv.set(
      storageKeys.todos,
      all.filter((t) => t.id !== id),
    );
  }
}
