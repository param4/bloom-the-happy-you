import { create } from 'zustand';

import type { Profile } from '@/domain/profile';
import { getContainer, type AppServices } from '@/services/container';

interface ProfileState {
  profile: Profile | null;
  hydrated: boolean;
  hydrate(): Promise<void>;
  /** Called by auth flows after IProfileService persists the profile. */
  setProfile(profile: Profile): void;
  signOut(): Promise<void>;
}

export const createProfileStore = (services: AppServices) =>
  create<ProfileState>()((set) => ({
    profile: null,
    hydrated: false,
    async hydrate() {
      const profile = await services.profileService.getCurrent();
      set({ profile, hydrated: true });
    },
    setProfile(profile) {
      set({ profile });
    },
    async signOut() {
      await services.profileService.signOut();
      set({ profile: null });
    },
  }));

export const useProfileStore = createProfileStore(getContainer());
