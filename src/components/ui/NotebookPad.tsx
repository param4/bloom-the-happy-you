import { BookHeart, Shuffle } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

interface NotebookPadProps {
  prompt: string;
  value: string;
  onChangeText: (text: string) => void;
  /** When provided, shows a shuffle button to roll another prompt. */
  onShuffle?: () => void;
  editable?: boolean;
}

/** Lined, serif writing surface with a BookHeart prompt header. */
export function NotebookPad({
  prompt,
  value,
  onChangeText,
  onShuffle,
  editable = true,
}: NotebookPadProps) {
  const { colors } = useTheme();
  return (
    <View
      className="mt-4 rounded-[18px] border border-line bg-card p-[18px]"
      style={shadows.softer}
    >
      <View className="mb-3 flex-row items-start gap-2">
        <BookHeart size={18} color={colors.accent} style={{ marginTop: 3 }} />
        <Text className="flex-1 font-serif-italic text-[17px] leading-[24px] text-ink">
          {prompt}
        </Text>
        {onShuffle ? (
          <Pressable onPress={onShuffle} accessibilityLabel="Another prompt" hitSlop={8}>
            <Shuffle size={16} color={colors.inkSoft} />
          </Pressable>
        ) : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline
        placeholder="Write in your own words…"
        placeholderTextColor={colors.inkSoft}
        className="min-h-[110px] font-serif text-[19px] leading-[32px] text-ink"
        textAlignVertical="top"
        style={{ lineHeight: 32 }}
      />
    </View>
  );
}
