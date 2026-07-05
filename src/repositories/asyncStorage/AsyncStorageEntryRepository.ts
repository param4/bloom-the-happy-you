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
    const all = await this.getAll(kind);
    await this.kv.set(storageKeys.entries(kind), [entry, ...all]);
  }

  async remove(kind: EntryKind, id: string): Promise<void> {
    const all = await this.getAll(kind);
    await this.kv.set(
      storageKeys.entries(kind),
      all.filter((e) => e.id !== id),
    );
  }
}
