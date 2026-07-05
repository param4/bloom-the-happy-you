import { create } from 'zustand';

/** A piece of content to render as a shareable image card. */
export interface ShareItem {
  kind: 'entry' | 'affirmation' | 'recap';
  /** Small uppercase kicker, e.g. "grateful for". */
  label: string;
  /** The main body text. */
  text: string;
  /** Optional ISO/dateKey shown in the footer; defaults to today. */
  dateKey?: string;
}

interface ShareCardState {
  item: ShareItem | null;
  open(item: ShareItem): void;
  close(): void;
}

/** App-level share-card modal state (opened from entries, affirmations, recap). */
export const useShareCardStore = create<ShareCardState>()((set) => ({
  item: null,
  open(item) {
    set({ item });
  },
  close() {
    set({ item: null });
  },
}));
