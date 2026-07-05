import { useAuth, useUser } from '@clerk/clerk-expo';
import type { UserResource } from '@clerk/types';
import { useEffect } from 'react';

import type { Profile } from '@/domain/profile';
import { useServices } from '@/providers/ServicesProvider';
import { useProfileStore } from '@/state/profileStore';

/**
 * The single bridge between Clerk (the source of authenticated identity, which
 * lives in the React hook tree) and the app's `profileStore` (the single source
 * of truth every auth gate reads). Clerk's session drives the local `profile`;
 * the projection is also persisted through the repo so boot hydration works
 * offline. Renders nothing.
 *
 * Guest sessions have no Clerk account (`profile.id` is undefined) and are left
 * completely untouched here — they're driven entirely by the local ProfileService.
 */
export function ClerkProfileSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { profiles } = useServices();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const existing = useProfileStore.getState().profile;
      const profile: Profile = {
        id: user.id,
        name: deriveName(user),
        email: user.primaryEmailAddress?.emailAddress ?? '',
        avatarUrl: user.hasImage ? user.imageUrl : undefined,
        // Carry onboarding state forward for the same account; a new account
        // starts un-onboarded so it runs the 60-second flow.
        onboarded: existing?.id === user.id ? existing.onboarded : false,
      };
      void profiles.save(profile);
      useProfileStore.getState().setProfile(profile);
      return;
    }

    // Clerk session ended (signed out here or elsewhere). Only clear a
    // Clerk-backed profile; never disturb a local guest session.
    const existing = useProfileStore.getState().profile;
    if (existing?.id) {
      void profiles.clear();
      useProfileStore.setState({ profile: null });
    }
  }, [isLoaded, isSignedIn, user, profiles]);

  return null;
}

/** Best display name from Clerk, falling back to the email local-part. */
function deriveName(user: UserResource): string {
  const meta = (user.unsafeMetadata ?? {}) as { name?: string };
  return (
    meta.name?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.username ||
    user.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'friend'
  );
}
