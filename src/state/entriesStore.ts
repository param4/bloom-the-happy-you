import { create } from 'zustand';

import type { Entry, EntryKind } from '@/domain/entry';
import { newId } from '@/lib/ids';
import { todayKey } from '@/lib/dates';
import { getContainer, type AppServices } from '@/services/container';

import { useStreakStore } from './streakStore';

export interface EntryDraft {
  type: Entry['type'];
  content: string;
  videoUri?: string;
}

interface EntriesState {
  gratitude: Entry[];
  appreciation: Entry[];
  hydrate(): Promise<void>;
  addEntry(kind: EntryKind, draft: EntryDraft): Promise<void>;
}

export const createEntriesStore = (services: AppServices) =>
  create<EntriesState>()((set, get) => ({
    gratitude: [],
    appreciation: [],
    async hydrate() {
      const [gratitude, appreciation] = await Promise.all([
        services.entries.getAll('gratitude'),
        services.entries.getAll('appreciation'),
      ]);
      set({ gratitude, appreciation });
    },
    async addEntry(kind, draft) {
      const entry: Entry = {
        id: newId(),
        dateKey: todayKey(),
        joyful: true,
        ...draft,
      };
      await services.entries.add(kind, entry);
      set({ [kind]: [entry, ...get()[kind]] } as Pick<EntriesState, EntryKind>);
      // Journaling counts as showing up — the streak advances at most
      // once per day (StreakService owns that rule).
      await useStreakStore.getState().recordToday();
    },
  }));

export const useEntriesStore = createEntriesStore(getContainer());
