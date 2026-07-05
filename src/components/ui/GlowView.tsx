import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme/colors';

interface GlowViewProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  durationMs?: number;
}

/**
 * Replaces the web `glow` keyframe (pulsing sun-colored box-shadow) with an
 * animated shadow pulse. Android's elevation doesn't animate smoothly, so
 * the pulse rides on shadowOpacity (iOS) with a static elevation fallback.
 */
export function GlowView({
  className,
  style,
  durationMs = 3000,
  children,
}: PropsWithChildren<GlowViewProps>) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: durationMs / 2 }), -1, true);
  }, [pulse, durationMs]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.55 * pulse.value,
    shadowRadius: 23 * pulse.value,
  }));

  return (
    <Animated.View
      className={className}
      style={[
        {
          shadowColor: colors.sun,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
        },
        glowStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
