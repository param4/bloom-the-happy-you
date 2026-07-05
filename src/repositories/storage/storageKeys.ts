import type { EntryKind } from '@/domain/entry';

/** Versioned storage keys — bump the prefix on breaking schema changes. */
const PREFIX = 'bloom/v1';

export const storageKeys = {
  entries: (kind: EntryKind) => `${PREFIX}/entries:${kind}`,
  todos: `${PREFIX}/todos`,
  manifestations: `${PREFIX}/manifestations`,
  videos: `${PREFIX}/videos`,
  profile: `${PREFIX}/profile`,
  moods: `${PREFIX}/moods`,
  settings: `${PREFIX}/settings`,
  seeded: `${PREFIX}/seeded`,
} as const;
