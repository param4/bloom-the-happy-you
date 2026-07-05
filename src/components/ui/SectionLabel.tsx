import type { PropsWithChildren, ReactNode } from 'react';
import { Text, View } from 'react-native';

interface SectionLabelProps {
  /** Optional right-aligned action (e.g. "Open list"). */
  right?: ReactNode;
}

/** Uppercase soft section heading with an optional right-slot action. */
export function SectionLabel({ right, children }: PropsWithChildren<SectionLabelProps>) {
  return (
    <View className="mb-2.5 flex-row items-center justify-between">
      <Text className="font-body-extrabold text-xs uppercase tracking-widest text-ink-soft">
        {children}
      </Text>
      {right}
    </View>
  );
}
