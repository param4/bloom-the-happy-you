import { Lock } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/theme/colors';

/** Private-by-default reassurance banner. */
export function PrivacyNote() {
  return (
    <View className="mb-4 flex-row items-center gap-2.5 rounded-2xl bg-lav-light px-3.5 py-3">
      <Lock size={18} color={colors.lavDeep} />
      <Text className="flex-1 font-body text-[13px] leading-5 text-lav-deep">
        Private by default — only you can see these. Sharing is always your separate choice.
      </Text>
    </View>
  );
}
