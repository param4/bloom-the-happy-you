import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import type { Manifestation } from '@/domain/manifestation';
import { colors } from '@/theme/colors';
import { gradients } from '@/theme/gradients';

/** A dream that came true. */
export function ManifestedRow({ dream }: { dream: Manifestation }) {
  return (
    <GradientCard
      colors={gradients.manifested}
      direction="wide"
      className="flex-row items-center gap-3 rounded-[18px] p-4"
      style={{ borderWidth: 1, borderColor: `${colors.sun}55` }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${colors.sun}44` }}
      >
        <Star size={20} color={colors.peachDeep} fill={colors.sun} />
      </View>
      <View className="flex-1">
        <Text className="font-display text-[15px] text-ink">{dream.title}</Text>
        <Text className="font-body text-xs text-ink-soft">I dreamed this — and here it is.</Text>
      </View>
    </GradientCard>
  );
}
