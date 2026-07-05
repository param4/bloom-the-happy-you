import { Lock } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

/** Private-by-default reassurance banner. */
export function PrivacyNote() {
  const { colors } = useTheme();
  return (
    <View className="mb-[18px] flex-row items-center gap-2.5 rounded-2xl bg-accent-soft px-3.5 py-3">
      <Lock size={18} color={colors.accentDeep} />
      <Text className="flex-1 font-body text-[13px] leading-5 text-accent-deep">
        Every video is private and yours. Download it in a beautiful Bloom frame — or share it, if
        you choose.
      </Text>
    </View>
  );
}
