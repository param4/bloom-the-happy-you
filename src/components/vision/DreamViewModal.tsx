import { Check, Pencil, Sparkles, Star, Trash2, Undo2 } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { OverlayModal } from '@/components/ui/OverlayModal';
import { SoftButton } from '@/components/ui/SoftButton';
import type { Manifestation } from '@/domain/manifestation';
import { useTheme } from '@/theme/ThemeProvider';

interface DreamViewModalProps {
  /** The dream to view; the modal is visible while this is non-null. */
  dream: Manifestation | null;
  onClose(): void;
  onEdit(): void;
  onMarkAchieved(): void;
  onUndo(): void;
  onDelete(): void;
}

/**
 * Read-only detail view for a vision-board dream, shared by both active and
 * manifested dreams. Fields are display-only; editing happens via the Edit
 * action, which opens the add-dream form.
 */
export function DreamViewModal({
  dream,
  onClose,
  onEdit,
  onMarkAchieved,
  onUndo,
  onDelete,
}: DreamViewModalProps) {
  const { colors, gradients } = useTheme();
  const achieved = dream?.achieved;

  return (
    <OverlayModal
      visible={!!dream}
      onClose={onClose}
      footer={
        dream ? (
          <View className="flex-row gap-2.5">
            <SoftButton ghost raw onPress={onEdit} className="flex-1">
              <View className="flex-row items-center gap-2">
                <Pencil size={16} color={colors.ink} />
                <Text className="font-body-extrabold text-[15px] text-ink">Edit</Text>
              </View>
            </SoftButton>
            {achieved ? (
              <SoftButton onPress={onUndo} className="flex-1" raw>
                <View className="flex-row items-center gap-2">
                  <Undo2 size={16} color={colors.accentDeep} />
                  <Text className="font-body-extrabold text-[15px] text-accent-deep">Move back</Text>
                </View>
              </SoftButton>
            ) : (
              <SoftButton primary raw onPress={onMarkAchieved} className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Check size={16} color="#fff" />
                  <Text className="font-body-extrabold text-[15px] text-white">It came true</Text>
                </View>
              </SoftButton>
            )}
          </View>
        ) : null
      }
    >
      {dream ? (
        <View>
          {dream.imageUri ? (
            <Image
              source={{ uri: dream.imageUri }}
              className="h-[180px] w-full rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <GradientCard colors={gradients.heroBadge} className="h-[180px] justify-end rounded-2xl p-4">
              <Sparkles size={28} color={colors.accentDeep} />
            </GradientCard>
          )}

          {achieved && (
            <View
              className="mt-4 flex-row items-center gap-2 self-start rounded-full px-3 py-1.5"
              style={{ backgroundColor: `${colors.sun}33` }}
            >
              <Star size={15} color={colors.accentDeep} fill={colors.sun} />
              <Text className="font-body-extrabold text-xs text-accent-deep">Manifested ✨</Text>
            </View>
          )}

          <Text className="mt-4 font-serif text-[22px] leading-[27px] text-ink">{dream.title}</Text>
          <Text className="mt-2 font-body-italic text-[15px] leading-[21px] text-ink-soft">
            “{dream.affirmation}”
          </Text>

          {dream.why.trim().length > 0 && (
            <View className="mt-5">
              <Text className="font-body-extrabold text-xs uppercase tracking-wide text-ink-soft">
                Why it matters
              </Text>
              <Text className="mt-1.5 font-serif text-[15px] leading-[21px] text-ink">
                {dream.why}
              </Text>
            </View>
          )}

          <SoftButton raw onPress={onDelete} className="mt-5 self-start bg-transparent px-0 py-1">
            <View className="flex-row items-center gap-1.5">
              <Trash2 size={15} color={colors.inkSoft} />
              <Text className="font-body-extrabold text-[13px] text-ink-soft">Delete dream</Text>
            </View>
          </SoftButton>
        </View>
      ) : null}
    </OverlayModal>
  );
}
