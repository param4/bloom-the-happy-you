import { create } from 'zustand';

import type { StreakState } from '@/domain/streak';
import { todayKey } from '@/lib/dates';
import { getContainer, type AppServices } from '@/services/container';

interface StreakStoreState {
  streak: StreakState;
  hydrate(): Promise<void>;
  /** Record that the user showed up today (journaled an entry). */
  recordToday(): Promise<void>;
}

export const createStreakStore = (services: AppServices) =>
  create<StreakStoreState>()((set) => ({
    streak: { count: 0, graceDays: 0, lastActiveDateKey: null },
    async hydrate() {
      set({ streak: await services.streak.getState() });
    },
    async recordToday() {
      set({ streak: await services.streak.recordActivity(todayKey()) });
    },
  }));

export const useStreakStore = createStreakStore(getContainer());
