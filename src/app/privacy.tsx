import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopBar } from '@/components/ui/TopBar';

/**
 * In-app privacy policy — root-level route so it's reachable both signed-out
 * (from the welcome screen) and signed-in (from the profile menu). The hosted
 * copy for the Play Store listing lives in docs/privacy-policy.md.
 */

const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: 'Your entries stay on your device',
    body: 'Everything you create in Bloom — journal entries, voice notes, videos, photos, moods, to-dos and your streak — is stored only on this device. It is never uploaded, and we cannot see it.',
  },
  {
    heading: 'Your account',
    body: 'Creating an account is optional. If you do, your email address and name are stored securely by Clerk, our sign-in provider, and are used only to sign you in. Guest mode creates no account and sends nothing off the device.',
  },
  {
    heading: 'No tracking',
    body: 'Bloom has no ads, no analytics and no trackers. We do not sell or share any data.',
  },
  {
    heading: 'Permissions',
    body: 'Camera and microphone are used only while you record a moment; photos only when you pick an image for your vision board; notifications only for the daily reminder you set. Each is optional and asked for only when you use the feature.',
  },
  {
    heading: 'Deleting your data',
    body: '"Clear data" in your profile menu permanently removes all content, including recorded files. "Delete account" also removes your account from our sign-in provider. Uninstalling the app deletes all local data.',
  },
  {
    heading: 'Questions',
    body: 'You can reach the developer through the contact details on the app’s store listing.',
  },
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-cream" style={{ paddingTop: insets.top }}>
      <TopBar title="Privacy" />
      <ScrollView
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <Text className="mb-4 font-body text-[13px] text-ink-soft">
          Bloom is built to keep your inner world private. Effective 9 July 2026.
        </Text>
        {SECTIONS.map(({ heading, body }) => (
          <View key={heading} className="mb-4">
            <Text className="mb-1 font-serif text-[17px] text-ink">{heading}</Text>
            <Text className="font-body text-[13.5px] leading-5 text-ink-soft">{body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
