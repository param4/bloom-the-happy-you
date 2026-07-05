import type { ResurfaceItem } from '@/domain/resurface';
import type { IEntryRepository, IVideoRepository } from '@/repositories/interfaces';

import type { IMomentPicker } from './random';
import type { IResurfaceService } from './interfaces';

/**
 * "Lift me up" — gathers every joyful moment (videos + both pillars) and
 * picks one at random to show the user on a low day.
 */
export class ResurfaceService implements IResurfaceService {
  constructor(
    private readonly entries: IEntryRepository,
    private readonly videos: IVideoRepository,
    private readonly pick: IMomentPicker,
  ) {}

  async pickHappyMoment(): Promise<ResurfaceItem | null> {
    const [videos, gratitude, appreciation] = await Promise.all([
      this.videos.getAll(),
      this.entries.getAll('gratitude'),
      this.entries.getAll('appreciation'),
    ]);

    const happy: ResurfaceItem[] = [
      ...videos
        .filter((v) => v.mood === 'joyful')
        .map((video): ResurfaceItem => ({ kind: 'video', video })),
      ...gratitude
        .filter((e) => e.joyful)
        .map((entry): ResurfaceItem => ({ kind: 'entry', pillar: 'gratitude', entry })),
      ...appreciation
        .filter((e) => e.joyful)
        .map((entry): ResurfaceItem => ({ kind: 'entry', pillar: 'appreciation', entry })),
    ];

    return this.pick(happy);
  }
}
