import { create } from 'zustand';

import type { MoodKey } from '@/domain/mood';
import { todayKey } from '@/lib/dates';
import { getContainer, type AppServices } from '@/services/container';

interface MoodState {
  today: MoodKey | null;
  hydrate(): Promise<void>;
  pickMood(mood: MoodKey): Promise<void>;
}

export const createMoodStore = (services: AppServices) =>
  create<MoodState>()((set) => ({
    today: null,
    async hydrate() {
      const log = await services.moods.getForDate(todayKey());
      set({ today: log?.mood ?? null });
    },
    async pickMood(mood) {
      set({ today: mood });
      await services.moods.save({ dateKey: todayKey(), mood });
    },
  }));

export const useMoodStore = createMoodStore(getContainer());
