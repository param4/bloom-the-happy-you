import type { IKeyValueStore } from '@/repositories/storage/kvStore';
import { storageKeys } from '@/repositories/storage/storageKeys';

import type { IDataResetService } from './interfaces';

/**
 * Owns wiping the user's stored content (SRP). Clears journals, todos,
 * vision board, booth videos, mood logs and settings (streak + reminder),
 * so every repository reads its empty/default state afterwards. The profile
 * is intentionally left intact so the user stays in the app.
 */
export class DataResetService implements IDataResetService {
  constructor(private readonly kv: IKeyValueStore) {}

  async clearAll(): Promise<void> {
    const keys = [
      storageKeys.entries('gratitude'),
      storageKeys.entries('appreciation'),
      storageKeys.todos,
      storageKeys.manifestations,
      storageKeys.videos,
      storageKeys.moods,
      storageKeys.settings,
    ];
    await Promise.all(keys.map((key) => this.kv.remove(key)));
  }
}
