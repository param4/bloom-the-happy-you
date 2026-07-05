import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

interface TopBarProps {
  title: string;
  tint: string;
}

/** Back button + tinted screen title. */
export function TopBar({ title, tint }: TopBarProps) {
  const router = useRouter();
  return (
    <View className="flex-row items-center gap-3 px-5 pb-4 pt-5">
      <Pressable
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-xl bg-card"
        style={shadows.softer}
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={20} color={colors.ink} />
      </Pressable>
      <Text className="font-display text-2xl" style={{ color: tint }}>
        {title}
      </Text>
    </View>
  );
}
