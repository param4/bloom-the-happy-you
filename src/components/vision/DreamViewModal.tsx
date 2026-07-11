import { Check, Pencil, Trash2, Undo2 } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { DreamDetails } from '@/components/vision/DreamDetails';
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
  const { colors } = useTheme();
  const achieved = dream?.achieved;

  return (
    <OverlayModal
      visible={!!dream}
      onClose={onClose}
      footer={
        dream ? (
          <View className="flex-row gap-2.5">
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
            <SoftButton ghost raw onPress={onEdit}>
              <Pencil size={16} color={colors.ink} />
            </SoftButton>
            <SoftButton ghost raw onPress={onDelete}>
              <Trash2 size={16} color={colors.inkSoft} />
            </SoftButton>
          </View>
        ) : null
      }
    >
      {dream ? (
        <View>
          <DreamDetails dream={dream} showBadge />
        </View>
      ) : null}
    </OverlayModal>
  );
}
