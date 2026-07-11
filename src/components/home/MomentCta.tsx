import { Wand2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

/** The warm "your manifestation moment" call-to-action. */
export function MomentCta({ onPress }: { onPress(): void }) {
  const { gradients } = useTheme();
  return (
    <Pressable onPress={onPress} className="mt-4" style={shadows.accentGlow}>
      <GradientCard
        colors={gradients.accentSun}
        className="flex-row items-center gap-3 rounded-[22px]"
        style={{ padding: 18 }}
      >
        <Wand2 size={24} color="#fff" />
        <View className="flex-1">
          <Text className="font-serif text-base text-white">Your manifestation moment</Text>
          <Text className="font-body text-[13px] text-white opacity-95">
            Pause for 30 seconds with what you’re calling in.
          </Text>
        </View>
      </GradientCard>
    </Pressable>
  );
}
