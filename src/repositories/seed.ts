import type { Entry, EntryKind } from '@/domain/entry';
import type { Manifestation } from '@/domain/manifestation';
import { DEFAULT_SETTINGS } from '@/domain/settings';
import type { Todo } from '@/domain/todo';
import type { JoyVideo } from '@/domain/video';
import { daysAgoKey, todayKey } from '@/lib/dates';
import { colors } from '@/theme/colors';

import type {
  IEntryRepository,
  IManifestationRepository,
  ISettingsRepository,
  ITodoRepository,
  IVideoRepository,
} from './interfaces';
import type { IKeyValueStore } from './storage/kvStore';
import { storageKeys } from './storage/storageKeys';

/**
 * First-run seed data ported from Draft.jsx so the archive and resurfacing
 * feel alive immediately. Guarded by a one-time flag.
 */

const seedEntries = (kind: EntryKind): Entry[] => {
  const gratitude = [
    'the smell of rain this morning and my warm cup of chai',
    'my sister called just to check on me — it made my whole day',
    'a slow, unhurried breakfast with nowhere to be',
    'finishing something I’d been putting off for weeks',
  ];
  const appreciation = [
    'my mum, for her endless patience with me',
    'my own body, for carrying me through a long day',
    'the friend who always texts back, even at midnight',
    'myself, for choosing rest instead of pushing through',
  ];
  const src = kind === 'gratitude' ? gratitude : appreciation;
  return [
    { id: `${kind}1`, dateKey: daysAgoKey(1), type: 'text', content: src[0], joyful: true },
    { id: `${kind}2`, dateKey: daysAgoKey(2), type: 'text', content: src[1], joyful: true },
    { id: `${kind}3`, dateKey: daysAgoKey(5), type: 'text', content: src[2], joyful: false },
    { id: `${kind}4`, dateKey: daysAgoKey(41), type: 'text', content: src[3], joyful: true },
    { id: `${kind}5`, dateKey: daysAgoKey(73), type: 'text', content: src[0], joyful: false },
  ];
};

const seedVideos: JoyVideo[] = [
  { id: 'v1', dateKey: daysAgoKey(3), label: 'The day I got the news', mood: 'joyful', shared: false, color: colors.peach },
  { id: 'v2', dateKey: daysAgoKey(9), label: 'Sunset at the lake', mood: 'content', shared: false, color: colors.sage },
  { id: 'v3', dateKey: daysAgoKey(30), label: 'Dancing in the kitchen', mood: 'joyful', shared: false, color: colors.lav },
];

const seedManifestations: Manifestation[] = [
  {
    id: 'm1',
    title: 'My calm, light-filled home',
    affirmation: 'I am waking up in my own peaceful home, full of light and plants.',
    why: 'A space that feels like exhale.',
    achieved: false,
    hue: colors.sageLight,
  },
  {
    id: 'm2',
    title: 'Mornings that feel like mine',
    affirmation: 'I am moving my body every morning and it feels joyful, not forced.',
    why: 'I want to greet the day gently.',
    achieved: false,
    hue: colors.lavLight,
  },
  {
    id: 'm3',
    title: 'Work that lights me up',
    affirmation: 'I am doing work that feels meaningful and pays me well.',
    why: 'Proof it can happen.',
    achieved: true,
    hue: colors.creamDeep,
  },
];

const seedTodos = (): Todo[] => [
  { id: 't1', text: 'Drink a full glass of water before coffee', done: true, dateKey: todayKey() },
  { id: 't2', text: 'Step outside for 10 minutes of sun', done: false, dateKey: todayKey() },
  { id: 't3', text: 'Send the message I keep putting off', done: false, dateKey: todayKey() },
  { id: 't4', text: 'Tidy one small corner of the room', done: false, dateKey: todayKey() },
];

export interface SeedTargets {
  entries: IEntryRepository;
  todos: ITodoRepository;
  manifestations: IManifestationRepository;
  videos: IVideoRepository;
  settings: ISettingsRepository;
}

export async function seedIfFirstRun(kv: IKeyValueStore, repos: SeedTargets): Promise<void> {
  if (await kv.get<boolean>(storageKeys.seeded)) return;

  for (const kind of ['gratitude', 'appreciation'] as const) {
    // add() prepends, so insert oldest-first to end up newest-first.
    for (const entry of [...seedEntries(kind)].reverse()) {
      await repos.entries.add(kind, entry);
    }
  }
  for (const video of [...seedVideos].reverse()) await repos.videos.add(video);
  for (const m of [...seedManifestations].reverse()) await repos.manifestations.add(m);
  for (const todo of seedTodos()) await repos.todos.add(todo);

  // Prototype starts with a warm 12-day streak and 2 grace days.
  await repos.settings.save({
    ...DEFAULT_SETTINGS,
    streak: { count: 12, graceDays: 2, lastActiveDateKey: daysAgoKey(1) },
  });

  await kv.set(storageKeys.seeded, true);
}
