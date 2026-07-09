import { Star, Undo2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import type { Manifestation } from '@/domain/manifestation';
import { useTheme } from '@/theme/ThemeProvider';

/** A dream that came true. Tapping the row opens a read-only detail view. */
export function ManifestedRow({
  dream,
  onOpen,
  onUndo,
}: {
  dream: Manifestation;
  onOpen(): void;
  onUndo(): void;
}) {
  const { colors, gradients } = useTheme();
  return (
    <Pressable onPress={onOpen}>
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
      <Pressable
        onPress={onUndo}
        hitSlop={8}
        accessibilityLabel="Move back to active dreams"
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${colors.sun}44` }}
      >
        <Undo2 size={18} color={colors.accentDeep} />
      </Pressable>
      </GradientCard>
    </Pressable>
  );
}
