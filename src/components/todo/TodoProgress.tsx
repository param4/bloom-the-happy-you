import { Text, View } from 'react-native';

import { ProgressBar } from '@/components/ui/ProgressBar';

interface TodoProgressProps {
  done: number;
  total: number;
  compact?: boolean;
}

/** Progress track + "n of m" counter. */
export function TodoProgress({ done, total, compact }: TodoProgressProps) {
  if (total === 0) return null;
  return (
    <View className="flex-row items-center gap-3">
      <ProgressBar progress={done / total} height={compact ? 8 : 10} solid={compact} />
      <Text className="font-display text-[13px] text-ink-soft">
        {compact ? `${done}/${total}` : `${done} of ${total}`}
      </Text>
    </View>
  );
}
