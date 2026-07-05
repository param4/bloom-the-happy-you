import type { MoodLog } from '@/domain/mood';
import type { DateKey } from '@/lib/dates';

import type { IMoodRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

/** Mood logs stored as a dateKey → MoodLog map. */
export class AsyncStorageMoodRepository implements IMoodRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  private async getMap(): Promise<Record<DateKey, MoodLog>> {
    return (await this.kv.get<Record<DateKey, MoodLog>>(storageKeys.moods)) ?? {};
  }

  async getForDate(dateKey: DateKey): Promise<MoodLog | null> {
    const map = await this.getMap();
    return map[dateKey] ?? null;
  }

  async save(log: MoodLog): Promise<void> {
    const map = await this.getMap();
    map[log.dateKey] = log;
    await this.kv.set(storageKeys.moods, map);
  }
}
