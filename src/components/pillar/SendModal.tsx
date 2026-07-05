import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { OverlayModal } from '@/components/ui/OverlayModal';
import { SoftButton } from '@/components/ui/SoftButton';
import { shareText } from '@/lib/share';
import { useToastStore } from '@/state/toastStore';
import { useTheme } from '@/theme/ThemeProvider';

interface SendModalProps {
  entry: { content: string };
  visible: boolean;
  onClose: () => void;
}

/** "Send it" — turn a written appreciation into a message for the person. */
export function SendModal({ entry, visible, onClose }: SendModalProps) {
  const { colors } = useTheme();
  const [to, setTo] = useState('');
  const msg = `Hi${to ? ' ' + to.trim() : ''}, I was just reflecting and felt grateful for you — ${entry.content}. I wanted you to know. 💛`;

  const share = async () => {
    await shareText(msg);
    useToastStore.getState().flash('Sent with love 💛');
    setTo('');
    onClose();
  };

  const copy = async () => {
    await shareText(msg);
    useToastStore.getState().flash('Copied — go make their day.');
    setTo('');
    onClose();
  };

  return (
    <OverlayModal visible={visible} onClose={onClose}>
      <Text className="font-serif text-[22px] text-ink">Send your appreciation</Text>
      <Text className="mt-1 font-body text-[13px] text-ink-soft">
        Told, not just logged. This is the quietly powerful part.
      </Text>

      <TextInput
        value={to}
        onChangeText={setTo}
        placeholder="Their name (optional)"
        placeholderTextColor={colors.inkSoft}
        className="mt-4 rounded-xl border border-line bg-cream px-3 py-3 font-body text-[15px] text-ink"
      />

      <View className="mt-3.5 rounded-[16px] bg-accent-soft p-4">
        <Text className="font-serif text-[16px] leading-[24px] text-ink">{msg}</Text>
      </View>

      <View className="mt-4 flex-row gap-2.5">
        <SoftButton primary onPress={share} className="flex-1" raw>
          <Send size={16} color="#fff" />
          <Text className="font-body-extrabold text-[15px] text-white">Share</Text>
        </SoftButton>
        <SoftButton ghost onPress={copy}>
          Copy
        </SoftButton>
      </View>
    </OverlayModal>
  );
}
