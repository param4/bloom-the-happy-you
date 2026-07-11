import { Share2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { BrandedVideoModal } from '@/components/booth/BrandedVideoModal';
import { VideoCard } from '@/components/booth/VideoCard';
import { EntryCard } from '@/components/pillar/EntryCard';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoftButton } from '@/components/ui/SoftButton';
import { TopBar } from '@/components/ui/TopBar';
import type { Entry } from '@/domain/entry';
import type { JoyVideo } from '@/domain/video';
import { MONTHS } from '@/lib/dates';
import { useEntriesStore } from '@/state/entriesStore';
import { useShareCardStore } from '@/state/shareCardStore';
import { useVideosStore } from '@/state/videosStore';

/** "Your month, gathered" — every reflection this month, playable and shareable. */
export default function RecapScreen() {
  const gratitude = useEntriesStore((s) => s.gratitude);
  const appreciation = useEntriesStore((s) => s.appreciation);
  const videos = useVideosStore((s) => s.videos);
  const [frameVid, setFrameVid] = useState<JoyVideo | null>(null);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const monthPrefix = useMemo(() => `${y}-${`${m + 1}`.padStart(2, '0')}-`, [y, m]);
  const inMonth = <T extends { dateKey: string }>(arr: T[]) =>
    arr.filter((e) => e.dateKey.startsWith(monthPrefix));

  const g = inMonth(gratitude);
  const a = inMonth(appreciation);
  const v = inMonth(videos);

  const share = () => {
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

  const clipRows: JoyVideo[][] = [];
  for (let i = 0; i < v.length; i += 2) clipRows.push(v.slice(i, i + 2));

  return (
    <Screen safeBottom>
      <TopBar title="Your month" />

      <View className="px-5">
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

        <Section
          title="Everything you were grateful for"
          entries={g}
          empty="No gratitudes yet this month — today's a lovely place to start."
        />

        <Section
          title="Everything you appreciated"
          entries={a}
          empty="No appreciations yet this month — someone would love to hear it."
        />

        <View className="mt-7">
          <SectionLabel>Happy moments</SectionLabel>
          {v.length === 0 ? (
            <EmptyNote>Your Joy Booth is quiet this month — go capture a smile.</EmptyNote>
          ) : (
            <View className="gap-3">
              {clipRows.map((row, i) => (
                <View key={i} className="flex-row gap-3">
                  {row.map((video) => (
                    <VideoCard key={video.id} video={video} onOpenShare={setFrameVid} />
                  ))}
                  {row.length === 1 && <View className="flex-1" />}
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="mt-7">
          <SoftButton primary onPress={share} raw>
            <Share2 size={16} color="#fff" />
            <Text className="font-body-extrabold text-[15px] text-white">Share my month</Text>
          </SoftButton>
        </View>
      </View>

      <BrandedVideoModal video={frameVid} onClose={() => setFrameVid(null)} />
    </Screen>
  );
}

/** One titled list of reflections (text plays inline; voice/video have a play button). */
function Section({
  title,
  entries,
  empty,
}: {
  title: string;
  entries: Entry[];
  empty: string;
}) {
  return (
    <View className="mt-7">
      <SectionLabel>{title}</SectionLabel>
      {entries.length === 0 ? (
        <EmptyNote>{empty}</EmptyNote>
      ) : (
        <View className="gap-2.5">
          {entries.map((e) => (
            <EntryCard key={e.id} e={e} />
          ))}
        </View>
      )}
    </View>
  );
}
