import type { Entry, EntryKind } from '@/domain/entry';

import type { IEntryRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageEntryRepository implements IEntryRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async getAll(kind: EntryKind): Promise<Entry[]> {
    return (await this.kv.get<Entry[]>(storageKeys.entries(kind))) ?? [];
  }

  async add(kind: EntryKind, entry: Entry): Promise<void> {
    await this.kv.update<Entry[]>(storageKeys.entries(kind), (all) => [entry, ...(all ?? [])]);
  }

  async update(kind: EntryKind, entry: Entry): Promise<void> {
    await this.kv.update<Entry[]>(storageKeys.entries(kind), (all) =>
      (all ?? []).map((e) => (e.id === entry.id ? entry : e)),
    );
  }

  async remove(kind: EntryKind, id: string): Promise<void> {
    await this.kv.update<Entry[]>(storageKeys.entries(kind), (all) =>
      (all ?? []).filter((e) => e.id !== id),
    );
  }
}
