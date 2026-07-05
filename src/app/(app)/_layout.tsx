import { Redirect, Stack } from 'expo-router';

import { useProfileStore } from '@/state/profileStore';
import { colors } from '@/theme/colors';

/**
 * AUTH GATE — no profile means bounce to the entry route (covers deep links
 * and sign-out automatically). While login is hidden, `index` re-provisions a
 * guest there; when login is restored, `index` forwards to welcome. Declares
 * the app's modal routes.
 */
export default function AppLayout() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return <Redirect href="/" />;
  // Gate the app behind onboarding for profiles that haven't finished it.
  if (!profile.onboarded) return <Redirect href="/onboarding" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="pillar/[kind]" />
      <Stack.Screen
        name="lift-me-up"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen
        name="manifestation-moment"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen name="add-dream" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
