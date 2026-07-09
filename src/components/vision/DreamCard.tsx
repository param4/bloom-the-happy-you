import { Check, Pencil, Sparkles, Trash2 } from 'lucide-react-native';
import { Image, Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { GradientCard } from '@/components/ui/GradientCard';
import type { Manifestation } from '@/domain/manifestation';
import { useTheme } from '@/theme/ThemeProvider';

interface DreamCardProps {
  dream: Manifestation;
  onOpen(): void;
  onMarkAchieved(): void;
  onEdit(): void;
  onDelete(): void;
}

/** One active vision-board dream. Tapping the card opens a read-only detail view. */
export function DreamCard({ dream, onOpen, onMarkAchieved, onEdit, onDelete }: DreamCardProps) {
  const { colors, gradients } = useTheme();
  return (
    <Pressable onPress={onOpen} className="flex-1">
      <Card bordered className="overflow-hidden rounded-[20px]">
      <View>
        {dream.imageUri ? (
          <Image source={{ uri: dream.imageUri }} className="h-[92px] w-full" resizeMode="cover" />
        ) : (
          <GradientCard colors={gradients.heroBadge} className="h-[92px] justify-end p-2">
            <Sparkles size={20} color={colors.accentDeep} />
          </GradientCard>
        )}
        <Pressable
          onPress={onEdit}
          hitSlop={8}
          accessibilityLabel="Edit dream"
          className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-card/90"
          style={{ backgroundColor: `${colors.card}E6` }}
        >
          <Pencil size={15} color={colors.accentDeep} />
        </Pressable>
      </View>
      <View className="p-3">
        <Text className="font-serif text-[15px] leading-[19px] text-ink">{dream.title}</Text>
        <Text className="mt-1.5 font-body-italic text-xs leading-4 text-ink-soft">
          “{dream.affirmation}”
        </Text>
        <Pressable
          onPress={onMarkAchieved}
          className="mt-2.5 flex-row items-center justify-center gap-1.5 rounded-[10px] border border-accent bg-accent-soft py-[7px]"
        >
          <Check size={14} color={colors.accentDeep} />
          <Text className="font-body-extrabold text-xs text-accent-deep">It came true</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          className="mt-1.5 flex-row items-center justify-center gap-1.5 py-[6px]"
        >
          <Trash2 size={13} color={colors.inkSoft} />
          <Text className="font-body-extrabold text-xs text-ink-soft">Delete</Text>
        </Pressable>
      </View>
      </Card>
    </Pressable>
  );
}
