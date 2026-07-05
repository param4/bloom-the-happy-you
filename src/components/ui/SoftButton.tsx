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
  /** Peach filled variant with a warm glow. */
  primary?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Renders children directly when they aren't plain text. */
  raw?: boolean;
}

/** The prototype's rounded soft button with a press-scale spring. */
export function SoftButton({
  onPress,
  primary,
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

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 20 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 20 }))}
      className={`flex-row items-center justify-center gap-2 rounded-2xl px-5 py-3 ${
        primary ? 'bg-peach' : 'bg-card'
      } ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}
      style={[primary ? shadows.peachGlow : shadows.softer, animatedStyle, style]}
    >
      {raw ? (
        children
      ) : (
        <Text className={`font-display text-[15px] ${primary ? 'text-white' : 'text-ink'}`}>
          {children}
        </Text>
      )}
    </AnimatedPressable>
  );
}
