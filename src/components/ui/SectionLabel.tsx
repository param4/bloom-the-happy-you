import type { PropsWithChildren } from 'react';
import { Text } from 'react-native';

/** Uppercase soft section heading. */
export function SectionLabel({ children }: PropsWithChildren) {
  return (
    <Text className="mb-2.5 font-display text-xs uppercase tracking-widest text-ink-soft">
      {children}
    </Text>
  );
}
