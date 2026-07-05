import { Play, Quote } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import type { Entry } from '@/domain/entry';
import { fmtDay } from '@/lib/dates';

interface EntryCardProps {
  entry: Entry;
  tint: string;
}

/** One saved reflection. */
export function EntryCard({ entry, tint }: EntryCardProps) {
  return (
    <Card className="flex-row gap-3 rounded-[18px] p-4">
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${tint}33` }}
      >
        {entry.type === 'video' ? <Play size={18} color={tint} /> : <Quote size={18} color={tint} />}
      </View>
      <View className="flex-1">
        <Text className="font-body text-[15px] leading-[22px] text-ink">
          {entry.type === 'video' ? '🎬 A recorded reflection' : entry.content}
        </Text>
        <Text className="mt-1 font-display text-xs text-ink-soft">{fmtDay(entry.dateKey)}</Text>
      </View>
    </Card>
  );
}
