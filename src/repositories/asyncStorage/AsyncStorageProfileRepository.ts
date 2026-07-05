import type { Profile } from '@/domain/profile';

import type { IProfileRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageProfileRepository implements IProfileRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  get(): Promise<Profile | null> {
    return this.kv.get<Profile>(storageKeys.profile);
  }

  save(profile: Profile): Promise<void> {
    return this.kv.set(storageKeys.profile, profile);
  }

  clear(): Promise<void> {
    return this.kv.remove(storageKeys.profile);
  }
}
