import { BloomLogo } from '@/components/ui/BloomLogo';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { useBurstStore } from '@/state/burstStore';
import { useTheme } from '@/theme/ThemeProvider';

/** A single expanding ring. */
function Ring({ color, size, delay }: { color: string; size: number; delay: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }));
  }, [p, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.7 * (1 - p.value),
    transform: [{ scale: 0.3 + p.value * 2.1 }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: color,
        },
        style,
      ]}
    />
  );
}

/** Host — mount once above the navigator; replays on each burst token bump. */
export function BloomBurst() {
  const token = useBurstStore((s) => s.token);
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const pop = useSharedValue(0);

  useEffect(() => {
    if (token === 0) return;
    setVisible(true);
    pop.value = 0;
    pop.value = withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }, (done) => {
      if (done) runOnJS(setVisible)(false);
    });
  }, [token, pop]);

  const popStyle = useAnimatedStyle(() => {
    const scale = pop.value < 0.45 ? 0.2 + (pop.value / 0.45) * 0.95 : 1.15 + (pop.value - 0.45) * 0.82;
    const opacity = pop.value < 0.45 ? pop.value / 0.45 : 1 - (pop.value - 0.45) / 0.55;
    return { opacity, transform: [{ scale }] };
  });

  if (!visible) return null;

  return (
    <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
      <Ring color={colors.accent} size={120} delay={0} />
      <Ring color={colors.sun} size={200} delay={150} />
      <Animated.View style={popStyle}>
        <BloomLogo size={92} color={colors.accent} strokeWidth={1.6} />
      </Animated.View>
    </View>
  );
}
