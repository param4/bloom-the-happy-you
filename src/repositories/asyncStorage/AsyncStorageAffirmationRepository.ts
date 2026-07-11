import type { Affirmation } from '@/domain/affirmation';

import type { IAffirmationRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageAffirmationRepository implements IAffirmationRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async getAll(): Promise<Affirmation[]> {
    return (await this.kv.get<Affirmation[]>(storageKeys.affirmations)) ?? [];
  }

  async add(affirmation: Affirmation): Promise<void> {
    await this.kv.update<Affirmation[]>(storageKeys.affirmations, (all) => [
      affirmation,
      ...(all ?? []),
    ]);
  }

  async update(affirmation: Affirmation): Promise<void> {
    await this.kv.update<Affirmation[]>(storageKeys.affirmations, (all) =>
      (all ?? []).map((a) => (a.id === affirmation.id ? affirmation : a)),
    );
  }

  async remove(id: string): Promise<void> {
    await this.kv.update<Affirmation[]>(storageKeys.affirmations, (all) =>
      (all ?? []).filter((a) => a.id !== id),
    );
  }
}
