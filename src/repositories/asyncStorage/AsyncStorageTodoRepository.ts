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
    await this.kv.update<Todo[]>(storageKeys.todos, (all) => [...(all ?? []), todo]);
  }

  async update(todo: Todo): Promise<void> {
    await this.kv.update<Todo[]>(storageKeys.todos, (all) =>
      (all ?? []).map((t) => (t.id === todo.id ? todo : t)),
    );
  }

  async remove(id: string): Promise<void> {
    await this.kv.update<Todo[]>(storageKeys.todos, (all) =>
      (all ?? []).filter((t) => t.id !== id),
    );
  }
}
