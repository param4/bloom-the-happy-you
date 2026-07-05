import { create } from 'zustand';

import type { JoyVideo } from '@/domain/video';
import { newId } from '@/lib/ids';
import { todayKey } from '@/lib/dates';
import { getContainer, type AppServices } from '@/services/container';

interface VideosState {
  videos: JoyVideo[];
  hydrate(): Promise<void>;
  /** Persist a recorded clip (uri) or a placeholder joy note (no uri). */
  add(label: string, uri?: string): Promise<void>;
}

export const createVideosStore = (services: AppServices) =>
  create<VideosState>()((set, get) => ({
    videos: [],
    async hydrate() {
      set({ videos: await services.videos.getAll() });
    },
    async add(label, uri) {
      const video: JoyVideo = {
        id: newId(),
        dateKey: todayKey(),
        label: label.trim() || 'A happy moment',
        mood: 'joyful',
        uri,
      };
      await services.videos.add(video);
      set({ videos: [video, ...get().videos] });
    },
  }));

export const useVideosStore = createVideosStore(getContainer());
