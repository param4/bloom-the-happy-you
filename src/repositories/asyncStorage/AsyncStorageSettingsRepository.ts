import { DEFAULT_SETTINGS, type Settings } from '@/domain/settings';

import type { ISettingsRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

/**
 * Merge stored settings over defaults so settings persisted before a new field
 * was added still resolve that field instead of undefined. Nested objects get
 * the same treatment (a shallow spread would drop new nested fields, silently
 * breaking e.g. the streak grace math).
 */
const withDefaults = (stored: Settings | null): Settings =>
  stored
    ? {
        ...DEFAULT_SETTINGS,
        ...stored,
        streak: { ...DEFAULT_SETTINGS.streak, ...stored.streak },
      }
    : DEFAULT_SETTINGS;

export class AsyncStorageSettingsRepository implements ISettingsRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async get(): Promise<Settings> {
    return withDefaults(await this.kv.get<Settings>(storageKeys.settings));
  }

  save(settings: Settings): Promise<void> {
    return this.kv.set(storageKeys.settings, settings);
  }

  update(updater: (settings: Settings) => Settings): Promise<Settings> {
    return this.kv.update<Settings>(storageKeys.settings, (stored) =>
      updater(withDefaults(stored)),
    );
  }
}
