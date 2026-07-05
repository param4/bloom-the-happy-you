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
    const all = await this.getAll();
    await this.kv.set(storageKeys.affirmations, [affirmation, ...all]);
  }

  async update(affirmation: Affirmation): Promise<void> {
    const all = await this.getAll();
    await this.kv.set(
      storageKeys.affirmations,
      all.map((a) => (a.id === affirmation.id ? affirmation : a)),
    );
  }

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await this.kv.set(
      storageKeys.affirmations,
      all.filter((a) => a.id !== id),
    );
  }
}
