import type { JoyVideo } from '@/domain/video';

import type { IVideoRepository } from '../interfaces';
import type { IKeyValueStore } from '../storage/kvStore';
import { storageKeys } from '../storage/storageKeys';

export class AsyncStorageVideoRepository implements IVideoRepository {
  constructor(private readonly kv: IKeyValueStore) {}

  async getAll(): Promise<JoyVideo[]> {
    return (await this.kv.get<JoyVideo[]>(storageKeys.videos)) ?? [];
  }

  async add(video: JoyVideo): Promise<void> {
    await this.kv.update<JoyVideo[]>(storageKeys.videos, (all) => [video, ...(all ?? [])]);
  }

  async update(video: JoyVideo): Promise<void> {
    await this.kv.update<JoyVideo[]>(storageKeys.videos, (all) =>
      (all ?? []).map((v) => (v.id === video.id ? video : v)),
    );
  }

  async remove(id: string): Promise<void> {
    await this.kv.update<JoyVideo[]>(storageKeys.videos, (all) =>
      (all ?? []).filter((v) => v.id !== id),
    );
  }
}
