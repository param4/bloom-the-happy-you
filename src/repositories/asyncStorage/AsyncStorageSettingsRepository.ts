import { DEFAULT_SETTINGS, type Settings } from '@/domain/settings';

import type { ISettingsRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageSettingsRepository implements ISettingsRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async get(): Promise<Settings> {
    const stored = await this.kv.get<Settings>(storageKeys.settings);
    return stored ?? DEFAULT_SETTINGS;
  }

  save(settings: Settings): Promise<void> {
    return this.kv.set(storageKeys.settings, settings);
  }
}
