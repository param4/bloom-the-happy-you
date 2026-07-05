import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

interface PillProps {
  bg: string;
  color: string;
}

/** Tiny rounded count/label chip. */
export function Pill({ bg, color, children }: PropsWithChildren<PillProps>) {
  return (
    <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: bg }}>
      <Text className="font-body-bold text-xs" style={{ color }}>
        {children}
      </Text>
    </View>
  );
}
