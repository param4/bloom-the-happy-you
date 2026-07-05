import { create } from 'zustand';

import type { Affirmation } from '@/domain/affirmation';
import { newId } from '@/lib/ids';
import { getContainer, type AppServices } from '@/services/container';

interface AffirmationsState {
  affirmations: Affirmation[];
  hydrate(): Promise<void>;
  add(text: string): Promise<void>;
  remove(id: string): Promise<void>;
}

export const createAffirmationsStore = (services: AppServices) =>
  create<AffirmationsState>()((set, get) => ({
    affirmations: [],
    async hydrate() {
      set({ affirmations: await services.affirmations.getAll() });
    },
    async add(text) {
      const affirmation: Affirmation = { id: newId(), text: text.trim() };
      await services.affirmations.add(affirmation);
      set({ affirmations: [affirmation, ...get().affirmations] });
    },
    async remove(id) {
      await services.affirmations.remove(id);
      set({ affirmations: get().affirmations.filter((a) => a.id !== id) });
    },
  }));

export const useAffirmationsStore = createAffirmationsStore(getContainer());
