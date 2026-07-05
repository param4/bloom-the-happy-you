import { ChevronRight, Heart, Sparkles, Sun, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { EntryKind } from '@/domain/entry';
import { useTheme } from '@/theme/ThemeProvider';

interface PillarCardsProps {
  onOpenPillar(kind: EntryKind): void;
  onOpenVision(): void;
}

interface PillarMeta {
  key: EntryKind | 'vision';
  title: string;
  sub: string;
  Icon: LucideIcon;
}

const PILLARS: PillarMeta[] = [
  { key: 'gratitude', title: 'Gratitude', sub: 'What I received today', Icon: Heart },
  { key: 'appreciation', title: 'Appreciation', sub: 'Who or what I value', Icon: Sun },
  { key: 'vision', title: 'Manifestation', sub: "What I'm reaching toward", Icon: Sparkles },
];

/** The three daily pillars — flat accent-soft tiles. */
export function PillarCards({ onOpenPillar, onOpenVision }: PillarCardsProps) {
  const { colors } = useTheme();
  return (
    <View className="mt-5">
      <SectionLabel>Today's three pillars</SectionLabel>
      <View className="gap-3">
        {PILLARS.map(({ key, title, sub, Icon }) => (
          <Pressable
            key={key}
            onPress={() => (key === 'vision' ? onOpenVision() : onOpenPillar(key))}
          >
            <Card className="flex-row items-center gap-3.5 p-4">
              <View className="h-[54px] w-[54px] items-center justify-center rounded-2xl bg-accent-soft">
                <Icon size={26} color={colors.accentDeep} />
              </View>
              <View className="flex-1">
                <Text className="font-serif text-lg text-ink">{title}</Text>
                <Text className="font-body text-[13px] text-ink-soft">{sub}</Text>
              </View>
              <ChevronRight size={22} color={colors.inkSoft} />
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
