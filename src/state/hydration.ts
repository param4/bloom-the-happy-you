import { getContainer } from '@/services/container';

import { useAffirmationsStore } from './affirmationsStore';
import { useEntriesStore } from './entriesStore';
import { useManifestationsStore } from './manifestationsStore';
import { useMoodStore } from './moodStore';
import { useProfileStore } from './profileStore';
import { useStreakStore } from './streakStore';
import { useThemeStore } from './themeStore';
import { useTodosStore } from './todosStore';
import { useVideosStore } from './videosStore';

/**
 * Hydrates every store from persistence. The root layout holds the splash
 * screen until this resolves so the auth gate never sees a half-hydrated state.
 */
export async function hydrateAll(): Promise<void> {
  await Promise.all([
    useProfileStore.getState().hydrate(),
    useEntriesStore.getState().hydrate(),
    useTodosStore.getState().hydrate(),
    useManifestationsStore.getState().hydrate(),
    useVideosStore.getState().hydrate(),
    useMoodStore.getState().hydrate(),
    useStreakStore.getState().hydrate(),
    useAffirmationsStore.getState().hydrate(),
    useThemeStore.getState().hydrate(),
  ]);
}

/**
 * Wipes all stored user content, then re-hydrates the affected stores so the
 * UI reflects the now-empty/default state. The profile is left untouched.
 */
export async function resetContentData(): Promise<void> {
  await getContainer().dataReset.clearAll();
  await Promise.all([
    useEntriesStore.getState().hydrate(),
    useTodosStore.getState().hydrate(),
    useManifestationsStore.getState().hydrate(),
    useVideosStore.getState().hydrate(),
    useMoodStore.getState().hydrate(),
    useStreakStore.getState().hydrate(),
    useAffirmationsStore.getState().hydrate(),
  ]);
}
