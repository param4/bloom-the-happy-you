import { create } from 'zustand';

interface ToastState {
  message: string | null;
  flash(message: string, durationMs?: number): void;
  clear(): void;
}

/** Gentle toast messages ("Saved. A little more of you, kept safe."). */
export const useToastStore = create<ToastState>()((set, get) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return {
    message: null,
    flash(message, durationMs = 2200) {
      if (timer) clearTimeout(timer);
      set({ message });
      timer = setTimeout(() => get().clear(), durationMs);
    },
    clear() {
      if (timer) clearTimeout(timer);
      timer = null;
      set({ message: null });
    },
  };
});
