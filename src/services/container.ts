import { AsyncStorageAffirmationRepository } from '@/repositories/asyncStorage/AsyncStorageAffirmationRepository';
import { AsyncStorageEntryRepository } from '@/repositories/asyncStorage/AsyncStorageEntryRepository';
import { AsyncStorageManifestationRepository } from '@/repositories/asyncStorage/AsyncStorageManifestationRepository';
import { AsyncStorageMoodRepository } from '@/repositories/asyncStorage/AsyncStorageMoodRepository';
import { AsyncStorageProfileRepository } from '@/repositories/asyncStorage/AsyncStorageProfileRepository';
import { AsyncStorageSettingsRepository } from '@/repositories/asyncStorage/AsyncStorageSettingsRepository';
import { AsyncStorageTodoRepository } from '@/repositories/asyncStorage/AsyncStorageTodoRepository';
import { AsyncStorageVideoRepository } from '@/repositories/asyncStorage/AsyncStorageVideoRepository';
import type {
  IAffirmationRepository,
  IEntryRepository,
  IManifestationRepository,
  IMoodRepository,
  IProfileRepository,
  ISettingsRepository,
  ITodoRepository,
  IVideoRepository,
} from '@/repositories/interfaces';
import { AsyncStorageKvStore, type IKeyValueStore } from '@/repositories/storage/kvStore';

import { DataResetService } from './DataResetService';
import type {
  IDataResetService,
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
import { randomPicker, randomSource } from './random';
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
  affirmations: IAffirmationRepository;
  // services
  profileService: IProfileService;
  streak: IStreakService;
  resurface: IResurfaceService;
  moment: IMomentService;
  media: IMediaStore;
  notifications: INotificationService;
  dataReset: IDataResetService;
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
  const affirmations =
    overrides.affirmations ?? new AsyncStorageAffirmationRepository(kv);

  const media = overrides.media ?? new MediaStore();

  return {
    entries,
    todos,
    manifestations,
    videos,
    profiles,
    moods,
    settings,
    affirmations,
    profileService: overrides.profileService ?? new ProfileService(profiles),
    streak: overrides.streak ?? new StreakService(settings),
    resurface: overrides.resurface ?? new ResurfaceService(entries, videos, randomPicker),
    moment: overrides.moment ?? new MomentService(manifestations, settings, randomSource),
    media,
    notifications: overrides.notifications ?? new NotificationService(),
    dataReset: overrides.dataReset ?? new DataResetService(kv, media),
  };
}

/** Module-level singleton used by the app; tests build their own containers. */
let container: AppServices | null = null;

export function getContainer(): AppServices {
  if (!container) container = createContainer();
  return container;
}
