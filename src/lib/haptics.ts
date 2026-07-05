import * as Haptics from 'expo-haptics';

/** Gentle haptic vocabulary — fire-and-forget, never blocks the UI. */
export const haptics = {
  /** Picking a mood, toggling a chip. */
  select(): void {
    Haptics.selectionAsync().catch(() => {});
  },
  /** Saving an entry, keeping a clip, adding a dream. */
  success(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  /** Completing the whole list, a dream coming true. */
  celebrate(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
};
