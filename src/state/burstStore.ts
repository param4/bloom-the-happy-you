import { create } from 'zustand';

interface BurstState {
  /** Incrementing token; each bump replays the bloom-burst animation. */
  token: number;
  fire(): void;
}

/** Fires the celebratory BloomBurst overlay (on saving an entry, etc.). */
export const useBurstStore = create<BurstState>()((set, get) => ({
  token: 0,
  fire() {
    set({ token: get().token + 1 });
  },
}));
