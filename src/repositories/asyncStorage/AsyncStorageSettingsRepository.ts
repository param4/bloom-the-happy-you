import { DEFAULT_SETTINGS, type Settings } from '@/domain/settings';

import type { ISettingsRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageSettingsRepository implements ISettingsRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async get(): Promise<Settings> {
    const stored = await this.kv.get<Settings>(storageKeys.settings);
    // Merge over defaults so settings persisted before a new field was added
    // still resolve that field (e.g. recentDreamIds) instead of undefined.
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
  }

  save(settings: Settings): Promise<void> {
    return this.kv.set(storageKeys.settings, settings);
  }
}
