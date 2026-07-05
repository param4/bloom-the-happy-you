import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SectionLabel } from '@/components/ui/SectionLabel';
import type { EntryKind } from '@/domain/entry';
import type { Entry } from '@/domain/entry';
import type { ArchiveGroups } from '@/hooks/useArchive';
import { MONTHS } from '@/lib/dates';
import { useShareCardStore } from '@/state/shareCardStore';
import { shadows } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeProvider';

import { EntryCard } from './EntryCard';

interface ArchiveBrowserProps {
  years: ArchiveGroups['years'];
  kind: EntryKind;
}

/** "Look back" — drill from years into months into entries. */
export function ArchiveBrowser({ years, kind }: ArchiveBrowserProps) {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const yearKeys = Object.keys(years)
    .map(Number)
    .sort((a, b) => b - a);
  if (yearKeys.length === 0) return null;

  const shareEntry = (e: Entry) =>
    useShareCardStore.getState().open({
      kind: 'entry',
      label: kind === 'gratitude' ? 'grateful for' : 'appreciating',
      text: e.content,
      dateKey: e.dateKey,
    });

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
              <EntryCard
                key={entry.id}
                e={entry}
                onShare={entry.type === 'text' ? () => shareEntry(entry) : undefined}
              />
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
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="mb-2 flex-row items-center gap-3 rounded-[16px] border border-line bg-card px-4 py-3.5"
      style={shadows.softer}
    >
      <Calendar size={18} color={colors.inkSoft} />
      <Text className="flex-1 font-serif text-[16px] text-ink">{label}</Text>
      {count != null && (
        <View className="rounded-full bg-accent-soft px-2.5 py-0.5">
          <Text className="font-body-extrabold text-xs text-accent-deep">{count}</Text>
        </View>
      )}
      <ChevronRight size={18} color={colors.inkSoft} />
    </Pressable>
  );
}

function BackRow({ label, onPress }: { label: string; onPress(): void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} className="mb-3 flex-row items-center gap-1.5">
      <ChevronLeft size={18} color={colors.accentDeep} />
      <Text className="font-body-extrabold text-sm text-accent-deep">{label}</Text>
    </Pressable>
  );
}
