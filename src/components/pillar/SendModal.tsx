import { Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

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

/** Tone templates — each turns the reflection into a differently-worded note. */
const TEMPLATES: { id: string; label: string; build: (to: string, content: string) => string }[] = [
  {
    id: 'warm',
    label: 'Warm',
    build: (to, c) =>
      `Hi${to ? ' ' + to : ''}, I was just reflecting and felt grateful for you — ${c}. I wanted you to know. 💛`,
  },
  {
    id: 'short',
    label: 'Short & sweet',
    build: (to, c) => `${to ? to + ', ' : ''}quick note — ${c}. Grateful for you today. 💛`,
  },
  {
    id: 'heartfelt',
    label: 'Heartfelt',
    build: (to, c) =>
      `Hi${to ? ' ' + to : ''}, I don't say this enough: ${c}. It means more to me than you know — thank you for being you. 💛`,
  },
  {
    id: 'playful',
    label: 'Playful',
    build: (to, c) => `Hey${to ? ' ' + to : ''}! Surprise appreciation drop 💛 ${c}. That's the whole message ✨`,
  },
];

/** "Send it" — turn a written appreciation into a message for the person. */
export function SendModal({ entry, visible, onClose }: SendModalProps) {
  const { colors } = useTheme();
  const [to, setTo] = useState('');
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [msg, setMsg] = useState('');

  const buildWith = (id: string, name: string) =>
    (TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]).build(name.trim(), entry.content);

  // Reset to the default template whenever the modal opens for an entry.
  useEffect(() => {
    if (visible) {
      setTo('');
      setTemplateId(TEMPLATES[0].id);
      setMsg(buildWith(TEMPLATES[0].id, ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, entry.content]);

  // Picking a template rewrites the message (overriding manual edits by choice).
  const pickTemplate = (id: string) => {
    setTemplateId(id);
    setMsg(buildWith(id, to));
  };

  // Changing the name re-flows the current template's wording.
  const changeName = (name: string) => {
    setTo(name);
    setMsg(buildWith(templateId, name));
  };

  const finish = async (toast: string) => {
    await shareText(msg);
    useToastStore.getState().flash(toast);
    onClose();
  };

  return (
    <OverlayModal
      visible={visible}
      onClose={onClose}
      tall
      footer={
        <View className="flex-row gap-2.5">
          <SoftButton primary onPress={() => finish('Sent with love 💛')} className="flex-1" raw>
            <Send size={16} color="#fff" />
            <Text className="font-body-extrabold text-[15px] text-white">Share</Text>
          </SoftButton>
          <SoftButton ghost onPress={() => finish('Copied — go make their day.')}>
            Copy
          </SoftButton>
        </View>
      }
    >
      <Text className="font-serif text-[22px] text-ink">Send your appreciation</Text>
      <Text className="mt-1 font-body text-[13px] text-ink-soft">
        Told, not just logged. This is the quietly powerful part.
      </Text>

      <TextInput
        value={to}
        onChangeText={changeName}
        placeholder="Their name (optional)"
        placeholderTextColor={colors.inkSoft}
        className="mt-4 rounded-xl border border-line bg-cream px-3 py-3 font-body text-[15px] text-ink"
      />

      <Text className="mb-2 mt-4 font-body-extrabold text-xs uppercase tracking-wide text-ink-soft">
        Choose a tone
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {TEMPLATES.map((t) => {
          const active = t.id === templateId;
          return (
            <Pressable
              key={t.id}
              onPress={() => pickTemplate(t.id)}
              className={`rounded-full border px-3.5 py-2 ${
                active ? 'border-accent bg-accent-soft' : 'border-line bg-cream'
              }`}
            >
              <Text
                className={`font-body-extrabold text-[13px] ${
                  active ? 'text-accent-deep' : 'text-ink-soft'
                }`}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="mb-2 mt-4 font-body-extrabold text-xs uppercase tracking-wide text-ink-soft">
        Your message
      </Text>
      <View className="rounded-[16px] bg-accent-soft p-4">
        <TextInput
          value={msg}
          onChangeText={setMsg}
          multiline
          textAlignVertical="top"
          placeholder="Write your own words…"
          placeholderTextColor={colors.inkSoft}
          className="min-h-[130px] font-serif text-[16px] leading-[24px] text-ink"
        />
      </View>
    </OverlayModal>
  );
}
