import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { gradientDirections } from '@/theme/gradients';

interface GradientCardProps {
  colors: readonly [string, string, ...string[]];
  direction?: keyof typeof gradientDirections;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/** LinearGradient wrapper with the prototype's direction presets. */
export function GradientCard({
  colors,
  direction = 'diagonal',
  className,
  style,
  children,
}: PropsWithChildren<GradientCardProps>) {
  const { start, end } = gradientDirections[direction];
  return (
    <LinearGradient colors={colors} start={start} end={end} className={className} style={style}>
      {children}
    </LinearGradient>
  );
}
