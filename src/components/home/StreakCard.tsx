import { Text, View } from 'react-native';

import { BloomLogo } from '@/components/ui/BloomLogo';
import { Card } from '@/components/ui/Card';
import type { StreakState } from '@/domain/streak';
import { useTheme } from '@/theme/ThemeProvider';

/** The kind streak — grace days mean a missed day breaks nothing. */
export function StreakCard({ streak }: { streak: StreakState }) {
  const { colors } = useTheme();
  return (
    <Card className="mt-4 flex-row items-center gap-3.5 rounded-[20px] px-4 py-4">
      <BloomLogo size={38} color={colors.accent} />
      <View className="flex-1">
        <Text className="font-serif text-lg text-ink">
          Welcome back — {streak.count} {streak.count === 1 ? 'day' : 'days'} in
        </Text>
        <Text className="font-body text-[13px] text-ink-soft">
          {streak.graceDays} grace {streak.graceDays === 1 ? 'day' : 'days'} in your pocket. Miss a
          day and nothing breaks.
        </Text>
      </View>
    </Card>
  );
}
