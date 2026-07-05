import { Check, Sparkles } from 'lucide-react-native';
import { Image, Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { GradientCard } from '@/components/ui/GradientCard';
import type { Manifestation } from '@/domain/manifestation';
import { colors } from '@/theme/colors';
import { hueToWhite } from '@/theme/gradients';

interface DreamCardProps {
  dream: Manifestation;
  onMarkAchieved(): void;
}

/** One active vision-board dream. */
export function DreamCard({ dream, onMarkAchieved }: DreamCardProps) {
  return (
    <Card className="flex-1 overflow-hidden rounded-[20px]">
      {dream.imageUri ? (
        <Image source={{ uri: dream.imageUri }} className="h-[92px] w-full" resizeMode="cover" />
      ) : (
        <GradientCard
          colors={hueToWhite(dream.hue)}
          className="h-[92px] justify-end p-2"
        >
          <Sparkles size={20} color={colors.lavDeep} />
        </GradientCard>
      )}
      <View className="p-3">
        <Text className="font-display text-sm leading-[18px] text-ink">{dream.title}</Text>
        <Text className="mt-1.5 font-body-italic text-xs leading-4 text-ink-soft">
          “{dream.affirmation}”
        </Text>
        <Pressable
          onPress={onMarkAchieved}
          className="mt-2.5 flex-row items-center justify-center gap-1.5 rounded-[10px] border border-sage bg-sage-light py-1.5"
        >
          <Check size={14} color={colors.sageDeep} />
          <Text className="font-display text-xs text-sage-deep">It came true</Text>
        </Pressable>
      </View>
    </Card>
  );
}
