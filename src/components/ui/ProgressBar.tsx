import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme/ThemeProvider';
import { GradientCard } from './GradientCard';

interface ProgressBarProps {
  /** 0–1 */
  progress: number;
  height?: number;
  /** Single accent fill; defaults to the accent→sun gradient. */
  solid?: boolean;
}

/** Animated progress track from the today-list. */
export function ProgressBar({ progress, height = 10, solid }: ProgressBarProps) {
  const { colors, gradients } = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(1, Math.max(0, progress)), { duration: 400 });
  }, [progress, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View className="flex-1 overflow-hidden rounded-full bg-cream" style={{ height }}>
      <Animated.View style={[fillStyle, { height: '100%' }]}>
        {solid ? (
          <View className="h-full w-full" style={{ backgroundColor: colors.accent }} />
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
