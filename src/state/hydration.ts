import { getContainer } from '@/services/container';

import { useEntriesStore } from './entriesStore';
import { useManifestationsStore } from './manifestationsStore';
import { useMoodStore } from './moodStore';
import { useProfileStore } from './profileStore';
import { useStreakStore } from './streakStore';
import { useTodosStore } from './todosStore';
import { useVideosStore } from './videosStore';

/**
 * Seeds first-run data, then hydrates every store from persistence.
 * The root layout holds the splash screen until this resolves so the
 * auth gate never sees a half-hydrated state.
 */
export async function hydrateAll(): Promise<void> {
  await getContainer().seed();
  await Promise.all([
    useProfileStore.getState().hydrate(),
    useEntriesStore.getState().hydrate(),
    useTodosStore.getState().hydrate(),
    useManifestationsStore.getState().hydrate(),
    useVideosStore.getState().hydrate(),
    useMoodStore.getState().hydrate(),
    useStreakStore.getState().hydrate(),
  ]);
}
