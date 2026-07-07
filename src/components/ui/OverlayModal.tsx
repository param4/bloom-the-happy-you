import { X } from 'lucide-react-native';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

interface OverlayModalProps {
  visible: boolean;
  onClose: () => void;
  /** Darker scrim. */
  dim?: boolean;
  /** Taller sheet for content-heavy modals (e.g. compose/edit). */
  tall?: boolean;
  /** Pinned below the scroll area — action buttons stay visible as content grows. */
  footer?: ReactNode;
}

/**
 * Centered cream sheet used by in-place modals (share card, recap, send,
 * branded video). Scrim tap or the X closes it. For route-based modals use
 * ModalCard instead.
 *
 * The height constraint lives on the sheet itself (a direct child of the
 * full-screen scrim) so the `%` resolves against the screen — the body then
 * scrolls once content exceeds it, while `footer` stays pinned.
 */
export function OverlayModal({
  visible,
  onClose,
  dim,
  tall,
  footer,
  children,
}: PropsWithChildren<OverlayModalProps>) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Pressable
          onPress={onClose}
          className="flex-1 items-center justify-center p-5"
          style={{ backgroundColor: dim ? 'rgba(59,50,42,0.6)' : 'rgba(59,50,42,0.42)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] rounded-[26px] bg-cream p-[22px]"
            style={[shadows.soft, tall ? { height: '90%' } : { maxHeight: '90%' }]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ flexShrink: 1 }}
            >
              {children}
            </ScrollView>
            {footer ? <View className="pt-4">{footer}</View> : null}
            <Pressable
              onPress={onClose}
              className="absolute right-3.5 top-3.5 h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-card"
              style={shadows.softer}
              accessibilityLabel="Close"
            >
              <X size={18} color={colors.ink} />
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
