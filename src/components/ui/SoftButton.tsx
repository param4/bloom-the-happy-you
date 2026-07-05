import type { PropsWithChildren } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { shadows } from '@/theme/shadows';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SoftButtonProps {
  onPress?: () => void;
  /** Accent-filled variant with a warm glow. */
  primary?: boolean;
  /** Transparent, bordered variant. */
  ghost?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Renders children directly when they aren't plain text. */
  raw?: boolean;
}

/** The redesign's rounded soft button with a press-scale spring. */
export function SoftButton({
  onPress,
  primary,
  ghost,
  disabled,
  className,
  style,
  raw,
  children,
}: PropsWithChildren<SoftButtonProps>) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg = primary ? 'bg-accent' : ghost ? 'bg-transparent border border-line' : 'bg-card';
  const textColor = primary ? 'text-white' : 'text-ink';

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 20 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 20 }))}
      className={`flex-row items-center justify-center gap-2 rounded-[14px] px-5 py-3 ${bg} ${
        disabled ? 'opacity-50' : ''
      } ${className ?? ''}`}
      style={[primary ? shadows.accentGlow : ghost ? undefined : shadows.softer, animatedStyle, style]}
    >
      {raw ? (
        children
      ) : (
        <Text className={`font-body-extrabold text-[15px] ${textColor}`}>{children}</Text>
      )}
    </AnimatedPressable>
  );
}
