import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { GradientCard } from './GradientCard';
import { gradients } from '@/theme/gradients';
import { colors } from '@/theme/colors';

interface ProgressBarProps {
  /** 0–1 */
  progress: number;
  height?: number;
  /** Single color fill; defaults to the sage→sun gradient. */
  solid?: boolean;
}

/** Animated progress track from the today-list. */
export function ProgressBar({ progress, height = 10, solid }: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(1, Math.max(0, progress)), { duration: 400 });
  }, [progress, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      className="flex-1 overflow-hidden rounded-full bg-cream-deep"
      style={{ height }}
    >
      <Animated.View style={[fillStyle, { height: '100%' }]}>
        {solid ? (
          <View className="h-full w-full" style={{ backgroundColor: colors.sage }} />
        ) : (
          <GradientCard
            colors={gradients.progress}
            direction="horizontal"
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </Animated.View>
    </View>
  );
}
