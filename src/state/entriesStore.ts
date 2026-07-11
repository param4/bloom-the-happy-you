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
  audioUri?: string;
}

interface EntriesState {
  gratitude: Entry[];
  appreciation: Entry[];
  hydrate(): Promise<void>;
  addEntry(kind: EntryKind, draft: EntryDraft): Promise<void>;
  editEntry(kind: EntryKind, id: string, patch: Partial<EntryDraft>): Promise<void>;
  removeEntry(kind: EntryKind, id: string): Promise<void>;
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
      // once per day (StreakService owns that rule). The entry is already
      // persisted, so a streak-write failure must not fail this save
      // (a rejected promise here would read as "not saved" and invite a
      // retry that duplicates the entry).
      try {
        await useStreakStore.getState().recordToday();
      } catch {
        // The streak catches up on the next entry.
      }
    },
    async editEntry(kind, id, patch) {
      const current = get()[kind].find((e) => e.id === id);
      if (!current) return;
      const updated = { ...current, ...patch };
      await services.entries.update(kind, updated);
      set({ [kind]: get()[kind].map((e) => (e.id === id ? updated : e)) } as Pick<
        EntriesState,
        EntryKind
      >);
    },
    async removeEntry(kind, id) {
      const entry = get()[kind].find((e) => e.id === id);
      await services.entries.remove(kind, id);
      set({ [kind]: get()[kind].filter((e) => e.id !== id) } as Pick<EntriesState, EntryKind>);
      // Best-effort file cleanup once the record is gone, so deleted
      // reflections don't leave orphaned videos/audio on disk forever.
      const mediaUri = entry?.videoUri ?? entry?.audioUri;
      if (mediaUri) await services.media.remove(mediaUri).catch(() => {});
    },
  }));

export const useEntriesStore = createEntriesStore(getContainer());
