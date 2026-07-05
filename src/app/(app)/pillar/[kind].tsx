import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { ArchiveBrowser } from '@/components/pillar/ArchiveBrowser';
import { EntryCard } from '@/components/pillar/EntryCard';
import { EntryComposer } from '@/components/pillar/EntryComposer';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TopBar } from '@/components/ui/TopBar';
import type { EntryKind } from '@/domain/entry';
import { useArchive } from '@/hooks/useArchive';
import { haptics } from '@/lib/haptics';
import { useServices } from '@/providers/ServicesProvider';
import { useEntriesStore, type EntryDraft } from '@/state/entriesStore';
import { useToastStore } from '@/state/toastStore';
import { colors } from '@/theme/colors';

const isEntryKind = (v: unknown): v is EntryKind =>
  v === 'gratitude' || v === 'appreciation';

export default function PillarScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const { media } = useServices();
  const entries = useEntriesStore((s) =>
    isEntryKind(kind) ? s[kind] : s.gratitude,
  );
  const addEntry = useEntriesStore((s) => s.addEntry);
  const flash = useToastStore((s) => s.flash);
  const { recent, years } = useArchive(entries);

  if (!isEntryKind(kind)) return <Redirect href="/(app)/(tabs)" />;

  const isGratitude = kind === 'gratitude';
  const tint = isGratitude ? colors.sage : colors.peach;

  const onAdd = async (draft: EntryDraft) => {
    // Recordings land as volatile cache URIs — persist before saving.
    const videoUri = draft.videoUri ? await media.persistVideo(draft.videoUri) : undefined;
    await addEntry(kind, { ...draft, videoUri });
    haptics.success();
    flash('Saved. A little more of you, kept safe.');
  };

  return (
    <Screen>
      <TopBar
        title={isGratitude ? 'Gratitude' : 'Appreciation'}
        tint={isGratitude ? colors.sageDeep : colors.peachDeep}
      />
      <View className="px-5">
        <EntryComposer
          prompt={
            isGratitude ? 'What did today give you?' : 'Who or what do you value right now?'
          }
          onAdd={onAdd}
        />

        <View className="mt-6">
          <SectionLabel>The last few days</SectionLabel>
          {recent.length === 0 && (
            <EmptyNote>Nothing here yet — today's a lovely place to start.</EmptyNote>
          )}
          <View className="gap-2.5">
            {recent.map((entry) => (
              <EntryCard key={entry.id} entry={entry} tint={tint} />
            ))}
          </View>
        </View>

        <ArchiveBrowser years={years} tint={tint} />
      </View>
    </Screen>
  );
}
