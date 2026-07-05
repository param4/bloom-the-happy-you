import { Redirect, Stack } from 'expo-router';

import { useProfileStore } from '@/state/profileStore';
import { colors } from '@/theme/colors';

/**
 * AUTH GATE — no profile means straight back to welcome (covers deep links
 * and sign-out automatically). Declares the app's modal routes.
 */
export default function AppLayout() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return <Redirect href="/(auth)/welcome" />;

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
