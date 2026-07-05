import { Redirect } from 'expo-router';

import { useProfileStore } from '@/state/profileStore';

/** Entry redirect — hydration already completed in the root layout. */
export default function Index() {
  const profile = useProfileStore((s) => s.profile);
  return <Redirect href={profile ? '/(app)/(tabs)' : '/(auth)/welcome'} />;
}
