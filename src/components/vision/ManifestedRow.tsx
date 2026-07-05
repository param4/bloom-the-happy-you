import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import type { Manifestation } from '@/domain/manifestation';
import { useTheme } from '@/theme/ThemeProvider';

/** A dream that came true. */
export function ManifestedRow({ dream }: { dream: Manifestation }) {
  const { colors, gradients } = useTheme();
  return (
    <GradientCard
      colors={gradients.manifested}
      direction="wide"
      className="flex-row items-center gap-3 rounded-[18px] p-4"
      style={{ borderWidth: 1, borderColor: `${colors.sun}66` }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${colors.sun}44` }}
      >
        <Star size={20} color={colors.accentDeep} fill={colors.sun} />
      </View>
      <View className="flex-1">
        <Text className="font-serif text-base text-ink">{dream.title}</Text>
        <Text className="font-body text-xs text-ink-soft">I dreamed this — and here it is.</Text>
      </View>
    </GradientCard>
  );
}
