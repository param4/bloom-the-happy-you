import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/colors';

interface FieldProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  hint?: string;
  onChangeText: (text: string) => void;
}

/** Labeled cream input used in forms (vision board, composer…). */
export function Field({ label, hint, ...input }: FieldProps) {
  return (
    <View className="mb-3">
      {label ? (
        <Text className="mb-1.5 font-display text-[13px] text-ink">{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.inkSoft}
        className="rounded-xl border border-line bg-cream px-3 py-3 font-body text-[15px] text-ink"
        {...input}
      />
      {hint ? <Text className="mt-1 text-[11px] text-lav-deep">{hint}</Text> : null}
    </View>
  );
}
