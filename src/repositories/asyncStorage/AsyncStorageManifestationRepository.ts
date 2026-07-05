import type { Manifestation } from '@/domain/manifestation';

import type { IManifestationRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageManifestationRepository implements IManifestationRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async getAll(): Promise<Manifestation[]> {
    return (await this.kv.get<Manifestation[]>(storageKeys.manifestations)) ?? [];
  }

  async add(manifestation: Manifestation): Promise<void> {
    const all = await this.getAll();
    await this.kv.set(storageKeys.manifestations, [manifestation, ...all]);
  }

  async update(manifestation: Manifestation): Promise<void> {
    const all = await this.getAll();
    await this.kv.set(
      storageKeys.manifestations,
      all.map((m) => (m.id === manifestation.id ? manifestation : m)),
    );
  }
}
