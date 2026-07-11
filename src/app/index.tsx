import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { getContainer } from '@/services/container';
import { useProfileStore } from '@/state/profileStore';

/**
 * Entry redirect — hydration already completed in the root layout.
 *
 * Login visibility is controlled by the EXPO_PUBLIC_HIDE_LOGIN env flag (see
 * .env.example). When hidden, rather than sending signed-out users to the
 * `(auth)/welcome` screen, we silently continue them as a guest so the app
 * opens straight into the tabs. Hiding is explicit opt-in (the exact string
 * "true") so a build environment that's missing the var can never silently
 * ship with auth bypassed.
 */
const HIDE_LOGIN = process.env.EXPO_PUBLIC_HIDE_LOGIN === 'true';

export default function Index() {
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);

  useEffect(() => {
    if (!HIDE_LOGIN || profile) return;
    getContainer()
      .profileService.continueAsGuest()
      .then(setProfile);
  }, [profile, setProfile]);

  if (!profile) {
    // While the guest profile is being created, render nothing (splash still up
    // in the login-hidden case; otherwise fall through to the welcome screen).
    return HIDE_LOGIN ? null : <Redirect href="/(auth)/welcome" />;
  }
  // New profiles run the 60-second onboarding before entering the app.
  if (!profile.onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/(app)/(tabs)" />;
}
