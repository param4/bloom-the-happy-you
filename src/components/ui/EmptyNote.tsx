import type { PropsWithChildren } from 'react';
import { Text } from 'react-native';

/** Gentle empty-state copy. */
export function EmptyNote({ children }: PropsWithChildren) {
  return <Text className="px-0.5 py-2 font-body text-sm text-ink-soft">{children}</Text>;
}
