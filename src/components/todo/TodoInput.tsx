import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

interface TodoInputProps {
  onAdd(text: string): void;
}

/** "Add something for today…" row. */
export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <View className="mb-4 flex-row gap-2">
      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        returnKeyType="done"
        placeholder="Add something for today…"
        placeholderTextColor={colors.inkSoft}
        className="flex-1 rounded-2xl border border-line bg-card px-3.5 py-3 font-body text-[15px] text-ink"
        style={shadows.softer}
      />
      <Pressable
        onPress={submit}
        className="w-12 items-center justify-center rounded-2xl bg-peach"
        style={shadows.peachGlow}
        accessibilityLabel="Add task"
      >
        <Plus size={22} color="#fff" />
      </Pressable>
    </View>
  );
}
