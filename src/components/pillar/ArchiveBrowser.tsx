import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { ArchiveGroups } from '@/hooks/useArchive';
import { MONTHS } from '@/lib/dates';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

import { EntryCard } from './EntryCard';

interface ArchiveBrowserProps {
  years: ArchiveGroups['years'];
  tint: string;
}

/** "Look back" — drill from years into months into entries. */
export function ArchiveBrowser({ years, tint }: ArchiveBrowserProps) {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const yearKeys = Object.keys(years)
    .map(Number)
    .sort((a, b) => b - a);
  if (yearKeys.length === 0) return null;

  return (
    <View className="mt-6">
      <SectionLabel>Look back</SectionLabel>

      {year === null &&
        yearKeys.map((y) => (
          <ArchiveRow key={y} label={`${y}`} onPress={() => setYear(y)} />
        ))}

      {year !== null && month === null && (
        <>
          <BackRow label={`${year}`} onPress={() => setYear(null)} />
          {Object.keys(years[year])
            .map(Number)
            .sort((a, b) => b - a)
            .map((m) => (
              <ArchiveRow
                key={m}
                label={MONTHS[m]}
                count={years[year][m].length}
                onPress={() => setMonth(m)}
              />
            ))}
        </>
      )}

      {year !== null && month !== null && (
        <>
          <BackRow label={`${MONTHS[month]} ${year}`} onPress={() => setMonth(null)} />
          <View className="gap-2.5">
            {years[year][month].map((entry) => (
              <EntryCard key={entry.id} entry={entry} tint={tint} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function ArchiveRow({
  label,
  count,
  onPress,
}: {
  label: string;
  count?: number;
  onPress(): void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-2 flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3.5"
      style={shadows.softer}
    >
      <Calendar size={18} color={colors.inkSoft} />
      <Text className="flex-1 font-display text-[15px] text-ink">{label}</Text>
      {count != null && (
        <Pill bg={colors.sageLight} color={colors.sageDeep}>
          {count}
        </Pill>
      )}
      <ChevronRight size={18} color={colors.inkSoft} />
    </Pressable>
  );
}

function BackRow({ label, onPress }: { label: string; onPress(): void }) {
  return (
    <Pressable onPress={onPress} className="mb-3 flex-row items-center gap-1.5">
      <ChevronLeft size={18} color={colors.lavDeep} />
      <Text className="font-display text-sm text-lav-deep">{label}</Text>
    </Pressable>
  );
}
