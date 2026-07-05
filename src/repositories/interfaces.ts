import type { Affirmation } from '@/domain/affirmation';
import type { Entry, EntryKind } from '@/domain/entry';
import type { Manifestation } from '@/domain/manifestation';
import type { MoodLog } from '@/domain/mood';
import type { Profile } from '@/domain/profile';
import type { Settings } from '@/domain/settings';
import type { Todo } from '@/domain/todo';
import type { JoyVideo } from '@/domain/video';
import type { DateKey } from '@/lib/dates';

/**
 * Repository contracts — persistence only, no business rules (SRP).
 * Seven narrow interfaces instead of one god-store (ISP); consumers depend
 * on these, concrete impls are named only in the composition root (DIP).
 *
 * Contract shared by all implementations (LSP): list getters resolve to []
 * and single getters to null when nothing is stored — absence never throws.
 */

export interface IEntryRepository {
  getAll(kind: EntryKind): Promise<Entry[]>;
  add(kind: EntryKind, entry: Entry): Promise<void>;
  remove(kind: EntryKind, id: string): Promise<void>;
}

export interface ITodoRepository {
  getAll(): Promise<Todo[]>;
  add(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface IManifestationRepository {
  getAll(): Promise<Manifestation[]>;
  add(manifestation: Manifestation): Promise<void>;
  update(manifestation: Manifestation): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface IVideoRepository {
  getAll(): Promise<JoyVideo[]>;
  add(video: JoyVideo): Promise<void>;
  update(video: JoyVideo): Promise<void>;
  remove(id: string): Promise<void>;
}

export interface IProfileRepository {
  get(): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
  clear(): Promise<void>;
}

export interface IMoodRepository {
  getForDate(dateKey: DateKey): Promise<MoodLog | null>;
  save(log: MoodLog): Promise<void>;
}

export interface ISettingsRepository {
  get(): Promise<Settings>;
  save(settings: Settings): Promise<void>;
}

/** User-written ("my own") affirmations. */
export interface IAffirmationRepository {
  getAll(): Promise<Affirmation[]>;
  add(affirmation: Affirmation): Promise<void>;
  update(affirmation: Affirmation): Promise<void>;
  remove(id: string): Promise<void>;
}
