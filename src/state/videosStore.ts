import { create } from 'zustand';

import type { JoyVideo } from '@/domain/video';
import { newId } from '@/lib/ids';
import { todayKey } from '@/lib/dates';
import { getContainer, type AppServices } from '@/services/container';
import { colors } from '@/theme/colors';

const CLIP_COLORS = [colors.peach, colors.sage, colors.lav, colors.sun];

interface VideosState {
  videos: JoyVideo[];
  hydrate(): Promise<void>;
  /** Persist a recorded clip (uri) or a placeholder joy note (no uri). */
  add(label: string, uri?: string): Promise<void>;
  toggleShared(id: string): Promise<void>;
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
        shared: false,
        color: CLIP_COLORS[get().videos.length % CLIP_COLORS.length],
        uri,
      };
      await services.videos.add(video);
      set({ videos: [video, ...get().videos] });
    },
    async toggleShared(id) {
      const current = get().videos.find((v) => v.id === id);
      if (!current) return;
      const updated = { ...current, shared: !current.shared };
      await services.videos.update(updated);
      set({ videos: get().videos.map((v) => (v.id === id ? updated : v)) });
    },
  }));

export const useVideosStore = createVideosStore(getContainer());
