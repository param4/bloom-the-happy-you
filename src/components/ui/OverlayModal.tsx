import { X } from 'lucide-react-native';
import type { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

interface OverlayModalProps {
  visible: boolean;
  onClose: () => void;
  /** Darker scrim. */
  dim?: boolean;
}

/**
 * Centered cream sheet used by in-place modals (share card, recap, send,
 * branded video). Scrim tap or the X closes it. For route-based modals use
 * ModalCard instead.
 */
export function OverlayModal({
  visible,
  onClose,
  dim,
  children,
}: PropsWithChildren<OverlayModalProps>) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center p-5"
        style={{ backgroundColor: dim ? 'rgba(59,50,42,0.6)' : 'rgba(59,50,42,0.42)' }}
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-[400px]">
          <View className="max-h-[86%] rounded-[26px] bg-cream p-[22px]" style={shadows.soft}>
            <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
            <Pressable
              onPress={onClose}
              className="absolute right-3.5 top-3.5 h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-card"
              style={shadows.softer}
              accessibilityLabel="Close"
            >
              <X size={18} color={colors.ink} />
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
