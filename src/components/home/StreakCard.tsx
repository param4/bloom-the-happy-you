import { Flower2 } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import type { StreakState } from '@/domain/streak';
import { colors } from '@/theme/colors';

/** The kind streak — grace days mean a missed day breaks nothing. */
export function StreakCard({ streak }: { streak: StreakState }) {
  return (
    <Card className="mt-4 flex-row items-center gap-3.5 rounded-[20px] px-4 py-4">
      <Flower2 size={38} color={colors.peach} />
      <View className="flex-1">
        <Text className="font-display text-[17px] text-ink">
          {streak.count} {streak.count === 1 ? 'day' : 'days'} of showing up
        </Text>
        <Text className="font-body text-[13px] text-ink-soft">
          {streak.graceDays} grace {streak.graceDays === 1 ? 'day' : 'days'} in your pocket — miss
          a day, nothing breaks.
        </Text>
      </View>
    </Card>
  );
}
