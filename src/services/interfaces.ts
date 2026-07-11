import type { Manifestation } from '@/domain/manifestation';
import type { Profile } from '@/domain/profile';
import type { ReminderTime } from '@/domain/settings';
import type { ResurfaceItem } from '@/domain/resurface';
import type { StreakState } from '@/domain/streak';
import type { DateKey } from '@/lib/dates';

/**
 * Service contracts — each owns exactly one business rule (SRP).
 * UI/state layers depend on these, never on concrete classes (DIP).
 */

export type AuthResult =
  | { ok: true; profile: Profile }
  | { ok: false; error: string };

export type SocialProvider = 'Google' | 'Apple';

/** Owns credential validation and profile lifecycle. */
export interface IProfileService {
  signUp(name: string, email: string, password: string): Promise<AuthResult>;
  logIn(email: string, password: string): Promise<AuthResult>;
  socialSignIn(provider: SocialProvider): Promise<Profile>;
  continueAsGuest(): Promise<Profile>;
  /** Marks the current profile as having finished onboarding. */
  completeOnboarding(): Promise<Profile | null>;
  getCurrent(): Promise<Profile | null>;
  signOut(): Promise<void>;
}

/** Owns the kind-streak math: once-per-day increments and grace days. */
export interface IStreakService {
  getState(): Promise<StreakState>;
  /** Record that the user showed up on `dateKey`; returns the new state. */
  recordActivity(dateKey: DateKey): Promise<StreakState>;
}

/** Owns "lift me up": picking a random joyful moment to resurface. */
export interface IResurfaceService {
  pickHappyMoment(): Promise<ResurfaceItem | null>;
}

/** Owns the manifestation moment: picking a random active dream. */
export interface IMomentService {
  pickActiveDream(): Promise<Manifestation | null>;
}

/** Owns durable media storage — copies volatile cache URIs into app storage. */
export interface IMediaStore {
  persistVideo(tempUri: string): Promise<string>;
  persistImage(tempUri: string): Promise<string>;
  persistAudio(tempUri: string): Promise<string>;
  remove(uri: string): Promise<void>;
  /** Deletes every persisted media file (the whole app media directory). */
  removeAll(): Promise<void>;
}

/** Owns wiping all stored user content, including persisted media files
 *  (leaves the profile intact). */
export interface IDataResetService {
  clearAll(): Promise<void>;
}

/** Owns local notifications for the daily vision reminder. */
export interface INotificationService {
  requestPermission(): Promise<boolean>;
  /** Schedules the daily reminder; returns the notification id. */
  scheduleDaily(time: ReminderTime): Promise<string>;
  cancel(notificationId: string): Promise<void>;
}
