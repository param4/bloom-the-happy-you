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
  setAchieved(id: string, achieved: boolean): Promise<void>;
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
    async setAchieved(id, achieved) {
      const current = get().manifestations.find((m) => m.id === id);
      if (!current || current.achieved === achieved) return;
      const updated = { ...current, achieved };
      await services.manifestations.update(updated);
      set({
        manifestations: get().manifestations.map((m) => (m.id === id ? updated : m)),
      });
    },
  }));

export const useManifestationsStore = createManifestationsStore(getContainer());
