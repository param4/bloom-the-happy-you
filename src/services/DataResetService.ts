import type { IKeyValueStore } from '@/repositories/storage/kvStore';
import { storageKeys } from '@/repositories/storage/storageKeys';

import type { IDataResetService, IMediaStore } from './interfaces';

/**
 * Owns wiping the user's stored content (SRP). Clears journals, todos,
 * vision board, booth videos, mood logs and settings (streak + reminder),
 * and deletes every persisted media file, so nothing private outlives a
 * reset. The profile is intentionally left intact so the user stays in
 * the app (account deletion handles the profile separately).
 */
export class DataResetService implements IDataResetService {
  constructor(
    private readonly kv: IKeyValueStore,
    private readonly media: IMediaStore,
  ) {}

  async clearAll(): Promise<void> {
    const keys = [
      storageKeys.entries('gratitude'),
      storageKeys.entries('appreciation'),
      storageKeys.todos,
      storageKeys.manifestations,
      storageKeys.videos,
      storageKeys.moods,
      storageKeys.settings,
      storageKeys.affirmations,
    ];
    await Promise.all([...keys.map((key) => this.kv.remove(key)), this.media.removeAll()]);
  }
}
