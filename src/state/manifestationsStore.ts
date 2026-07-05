import { create } from 'zustand';

import type { Manifestation } from '@/domain/manifestation';
import { newId } from '@/lib/ids';
import { getContainer, type AppServices } from '@/services/container';

export interface DreamDraft {
  title: string;
  affirmation: string;
  why: string;
  imageUri?: string;
}

interface ManifestationsState {
  manifestations: Manifestation[];
  hydrate(): Promise<void>;
  add(draft: DreamDraft): Promise<void>;
  markAchieved(id: string): Promise<void>;
}

export const createManifestationsStore = (services: AppServices) =>
  create<ManifestationsState>()((set, get) => ({
    manifestations: [],
    async hydrate() {
      set({ manifestations: await services.manifestations.getAll() });
    },
    async add(draft) {
      const manifestation: Manifestation = {
        id: newId(),
        achieved: false,
        ...draft,
      };
      await services.manifestations.add(manifestation);
      set({ manifestations: [manifestation, ...get().manifestations] });
    },
    async markAchieved(id) {
      const current = get().manifestations.find((m) => m.id === id);
      if (!current) return;
      const updated = { ...current, achieved: true };
      await services.manifestations.update(updated);
      set({
        manifestations: get().manifestations.map((m) => (m.id === id ? updated : m)),
      });
    },
  }));

export const useManifestationsStore = createManifestationsStore(getContainer());
