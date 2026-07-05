import { Share2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { EmptyNote } from '@/components/ui/EmptyNote';
import { OverlayModal } from '@/components/ui/OverlayModal';
import { SoftButton } from '@/components/ui/SoftButton';
import type { Entry } from '@/domain/entry';
import { MONTHS } from '@/lib/dates';
import { useEntriesStore } from '@/state/entriesStore';
import { useShareCardStore } from '@/state/shareCardStore';
import { useVideosStore } from '@/state/videosStore';

interface RecapModalProps {
  visible: boolean;
  onClose(): void;
}

/** "Your month, gathered" — counts + this month's text entries, shareable. */
export function RecapModal({ visible, onClose }: RecapModalProps) {
  const gratitude = useEntriesStore((s) => s.gratitude);
  const appreciation = useEntriesStore((s) => s.appreciation);
  const videos = useVideosStore((s) => s.videos);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const monthPrefix = useMemo(() => `${y}-${`${m + 1}`.padStart(2, '0')}-`, [y, m]);
  const inMonth = <T extends { dateKey: string }>(arr: T[]) =>
    arr.filter((e) => e.dateKey.startsWith(monthPrefix));

  const g = inMonth(gratitude);
  const a = inMonth(appreciation);
  const v = inMonth(videos);

  const texts: Entry[] = [...g, ...a].filter((e) => e.type === 'text');

  const share = () => {
    onClose();
    useShareCardStore.getState().open({
      kind: 'recap',
      label: `${MONTHS[m]} in gratitude`,
      text: `${g.length} gratitudes, ${a.length} appreciations, ${v.length} joyful moments — and counting.`,
    });
  };

  const stats: [string, number][] = [
    ['Gratitudes', g.length],
    ['Appreciations', a.length],
    ['Joy clips', v.length],
  ];

  return (
    <OverlayModal visible={visible} onClose={onClose}>
      <View className="items-center">
        <Text className="font-body-extrabold text-[11px] uppercase tracking-widest text-accent-deep">
          Your month, gathered
        </Text>
        <Text className="mt-1.5 font-serif text-[26px] text-ink">
          {MONTHS[m]} {y}
        </Text>
      </View>

      <View className="my-4 flex-row gap-2">
        {stats.map(([label, n]) => (
          <View key={label} className="flex-1 items-center rounded-2xl bg-accent-soft px-2 py-3">
            <Text className="font-serif text-2xl text-accent-deep">{n}</Text>
            <Text className="font-body-bold text-[11px] text-accent-deep">{label}</Text>
          </View>
        ))}
      </View>

      <Text className="mb-2 font-body-extrabold text-[11px] uppercase tracking-widest text-ink-soft">
        Everything you were grateful for
      </Text>
      <View className="gap-2">
        {texts.map((e) => (
          <View key={e.id} className="rounded-[14px] border border-line bg-card px-3.5 py-3">
            <Text className="font-serif text-base leading-6 text-ink">“{e.content}”</Text>
          </View>
        ))}
        {texts.length === 0 && (
          <EmptyNote>This month is still a blank page — a lovely thing to fill.</EmptyNote>
        )}
      </View>

      <View className="mt-5 flex-row gap-2.5">
        <SoftButton primary onPress={share} raw className="flex-1">
          <Share2 size={16} color="#fff" />
          <Text className="font-body-extrabold text-[15px] text-white">Share my month</Text>
        </SoftButton>
        <SoftButton ghost onPress={onClose}>
          Close
        </SoftButton>
      </View>
    </OverlayModal>
  );
}
