import { AsyncStorageEntryRepository } from '@/repositories/asyncStorage/AsyncStorageEntryRepository';
import { AsyncStorageManifestationRepository } from '@/repositories/asyncStorage/AsyncStorageManifestationRepository';
import { AsyncStorageMoodRepository } from '@/repositories/asyncStorage/AsyncStorageMoodRepository';
import { AsyncStorageProfileRepository } from '@/repositories/asyncStorage/AsyncStorageProfileRepository';
import { AsyncStorageSettingsRepository } from '@/repositories/asyncStorage/AsyncStorageSettingsRepository';
import { AsyncStorageTodoRepository } from '@/repositories/asyncStorage/AsyncStorageTodoRepository';
import { AsyncStorageVideoRepository } from '@/repositories/asyncStorage/AsyncStorageVideoRepository';
import type {
  IEntryRepository,
  IManifestationRepository,
  IMoodRepository,
  IProfileRepository,
  ISettingsRepository,
  ITodoRepository,
  IVideoRepository,
} from '@/repositories/interfaces';
import { seedIfFirstRun } from '@/repositories/seed';
import { AsyncStorageKvStore, type IKeyValueStore } from '@/repositories/storage/kvStore';

import type {
  IMediaStore,
  IMomentService,
  INotificationService,
  IProfileService,
  IResurfaceService,
  IStreakService,
} from './interfaces';
import { MediaStore } from './MediaStore';
import { MomentService } from './MomentService';
import { NotificationService } from './NotificationService';
import { ProfileService } from './ProfileService';
import { randomPicker } from './random';
import { ResurfaceService } from './ResurfaceService';
import { StreakService } from './StreakService';

/**
 * COMPOSITION ROOT — the only file in the app that names concrete
 * repository/service classes (DIP). Everything else depends on the
 * interfaces exposed through AppServices.
 */

export interface AppServices {
  // repositories
  entries: IEntryRepository;
  todos: ITodoRepository;
  manifestations: IManifestationRepository;
  videos: IVideoRepository;
  profiles: IProfileRepository;
  moods: IMoodRepository;
  settings: ISettingsRepository;
  // services
  profileService: IProfileService;
  streak: IStreakService;
  resurface: IResurfaceService;
  moment: IMomentService;
  media: IMediaStore;
  notifications: INotificationService;
  /** Seeds prototype data on first run. */
  seed(): Promise<void>;
}

export function createContainer(overrides: Partial<AppServices> = {}): AppServices {
  const kv: IKeyValueStore = new AsyncStorageKvStore();

  const entries = overrides.entries ?? new AsyncStorageEntryRepository(kv);
  const todos = overrides.todos ?? new AsyncStorageTodoRepository(kv);
  const manifestations =
    overrides.manifestations ?? new AsyncStorageManifestationRepository(kv);
  const videos = overrides.videos ?? new AsyncStorageVideoRepository(kv);
  const profiles = overrides.profiles ?? new AsyncStorageProfileRepository(kv);
  const moods = overrides.moods ?? new AsyncStorageMoodRepository(kv);
  const settings = overrides.settings ?? new AsyncStorageSettingsRepository(kv);

  return {
    entries,
    todos,
    manifestations,
    videos,
    profiles,
    moods,
    settings,
    profileService: overrides.profileService ?? new ProfileService(profiles),
    streak: overrides.streak ?? new StreakService(settings),
    resurface: overrides.resurface ?? new ResurfaceService(entries, videos, randomPicker),
    moment: overrides.moment ?? new MomentService(manifestations, randomPicker),
    media: overrides.media ?? new MediaStore(),
    notifications: overrides.notifications ?? new NotificationService(),
    seed:
      overrides.seed ??
      (() => seedIfFirstRun(kv, { entries, todos, manifestations, videos, settings })),
  };
}

/** Module-level singleton used by the app; tests build their own containers. */
let container: AppServices | null = null;

export function getContainer(): AppServices {
  if (!container) container = createContainer();
  return container;
}
