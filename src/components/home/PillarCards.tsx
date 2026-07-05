import { ChevronRight, Heart, Sparkles, Sun, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { EntryKind } from '@/domain/entry';
import { colors } from '@/theme/colors';

interface PillarCardsProps {
  onOpenPillar(kind: EntryKind): void;
  onOpenVision(): void;
}

interface PillarMeta {
  key: EntryKind | 'vision';
  title: string;
  sub: string;
  Icon: LucideIcon;
  bg: string;
  tint: string;
}

const PILLARS: PillarMeta[] = [
  {
    key: 'gratitude',
    title: 'Gratitude',
    sub: 'What I received today',
    Icon: Heart,
    bg: colors.sageLight,
    tint: colors.sageDeep,
  },
  {
    key: 'appreciation',
    title: 'Appreciation',
    sub: 'Who or what I value',
    Icon: Sun,
    bg: '#FCEFD8',
    tint: colors.peachDeep,
  },
  {
    key: 'vision',
    title: 'Manifestation',
    sub: "What I'm reaching toward",
    Icon: Sparkles,
    bg: colors.lavLight,
    tint: colors.lavDeep,
  },
];

/** The three daily pillars. */
export function PillarCards({ onOpenPillar, onOpenVision }: PillarCardsProps) {
  return (
    <View className="mt-5">
      <SectionLabel>Today's three pillars</SectionLabel>
      <View className="gap-3">
        {PILLARS.map(({ key, title, sub, Icon, bg, tint }) => (
          <Pressable
            key={key}
            onPress={() => (key === 'vision' ? onOpenVision() : onOpenPillar(key))}
          >
            <Card className="flex-row items-center gap-3.5 p-4">
              <View
                className="h-[54px] w-[54px] items-center justify-center rounded-2xl"
                style={{ backgroundColor: bg }}
              >
                <Icon size={26} color={tint} />
              </View>
              <View className="flex-1">
                <Text className="font-display text-lg text-ink">{title}</Text>
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
