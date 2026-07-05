import { BookHeart, Shuffle } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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

const LINE_HEIGHT = 32;
const MIN_LINES = 4;

/** Lined, serif writing surface with a BookHeart prompt header. */
export function NotebookPad({
  prompt,
  value,
  onChangeText,
  onShuffle,
  editable = true,
}: NotebookPadProps) {
  const { colors } = useTheme();
  const [contentHeight, setContentHeight] = useState(0);
  const lines = Math.max(MIN_LINES, Math.ceil(contentHeight / LINE_HEIGHT));
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

      {/* Ruled writing area: lines grow with the text. */}
      <View style={{ minHeight: LINE_HEIGHT * lines }}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: lines }).map((_, i) => (
            <View
              key={i}
              style={{ height: LINE_HEIGHT, borderBottomWidth: 1, borderColor: colors.line }}
            />
          ))}
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
          editable={editable}
          multiline
          placeholder="Write in your own words…"
          placeholderTextColor={colors.inkSoft}
          className="font-serif text-[19px] text-ink"
          textAlignVertical="top"
          style={{ minHeight: LINE_HEIGHT * lines, lineHeight: LINE_HEIGHT, padding: 0 }}
        />
      </View>
    </View>
  );
}
