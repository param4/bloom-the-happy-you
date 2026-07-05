import { Redirect, Stack } from 'expo-router';

import { useProfileStore } from '@/state/profileStore';

/** Auth group — bounces into the app when a profile already exists. */
export default function AuthLayout() {
  const profile = useProfileStore((s) => s.profile);
  if (profile) return <Redirect href="/(app)/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
