import { Redirect, useLocalSearchParams } from 'expo-router';
import { Mic, PenLine, Send, Video } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { ArchiveBrowser } from '@/components/pillar/ArchiveBrowser';
import { EntryCard } from '@/components/pillar/EntryCard';
import { MiniVideoRecorder } from '@/components/pillar/MiniVideoRecorder';
import { SendModal } from '@/components/pillar/SendModal';
import { VoiceRecorder } from '@/components/pillar/VoiceRecorder';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { ModeChip } from '@/components/ui/ModeChip';
import { NotebookPad } from '@/components/ui/NotebookPad';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoftButton } from '@/components/ui/SoftButton';
import { TopBar } from '@/components/ui/TopBar';
import { PROMPTS, dayIndex } from '@/constants/prompts';
import type { Entry, EntryKind } from '@/domain/entry';
import { useArchive } from '@/hooks/useArchive';
import { haptics } from '@/lib/haptics';
import { useServices } from '@/providers/ServicesProvider';
import { useBurstStore } from '@/state/burstStore';
import { useEntriesStore } from '@/state/entriesStore';
import { useShareCardStore } from '@/state/shareCardStore';
import { useToastStore } from '@/state/toastStore';
import { useTheme } from '@/theme/ThemeProvider';

const isEntryKind = (v: unknown): v is EntryKind =>
  v === 'gratitude' || v === 'appreciation';

type Mode = 'write' | 'speak' | 'video';

export default function PillarScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const { colors } = useTheme();
  const { media } = useServices();
  const entries = useEntriesStore((s) =>
    isEntryKind(kind) ? s[kind] : s.gratitude,
  );
  const addEntry = useEntriesStore((s) => s.addEntry);
  const flash = useToastStore((s) => s.flash);
  const { recent, years } = useArchive(entries);

  const prompts = PROMPTS[isEntryKind(kind) ? kind : 'gratitude'];
  const [pi, setPi] = useState(dayIndex() % prompts.length);
  const [mode, setMode] = useState<Mode>('write');
  const [text, setText] = useState('');
  const [sendEntry, setSendEntry] = useState<{ content: string } | null>(null);

  if (!isEntryKind(kind)) return <Redirect href="/(app)/(tabs)" />;

  const isGratitude = kind === 'gratitude';

  const celebrate = () => {
    haptics.success();
    useBurstStore.getState().fire();
    flash('Saved. A little more of you, kept safe.');
  };

  const saveText = async () => {
    if (!text.trim()) return;
    await addEntry(kind, { type: 'text', content: text.trim() });
    setText('');
    celebrate();
  };

  const saveVoice = async (audioUri?: string) => {
    await addEntry(kind, { type: 'voice', content: 'A voice reflection', audioUri });
    celebrate();
  };

  const saveVideo = async (uri?: string) => {
    const videoUri = uri ? await media.persistVideo(uri) : undefined;
    await addEntry(kind, { type: 'video', content: 'A recorded reflection', videoUri });
    celebrate();
  };

  const shareEntry = (e: Entry) =>
    useShareCardStore.getState().open({
      kind: 'entry',
      label: isGratitude ? 'grateful for' : 'appreciating',
      text: e.content,
      dateKey: e.dateKey,
    });

  return (
    <Screen>
      <TopBar title={isGratitude ? 'Gratitude' : 'Appreciation'} />
      <View className="px-5">
        <NotebookPad
          prompt={prompts[pi]}
          value={mode === 'write' ? text : ''}
          onChangeText={setText}
          onShuffle={() => setPi((p) => (p + 1) % prompts.length)}
          editable={mode === 'write'}
        />

        <View className="mt-3 flex-row gap-2">
          <ModeChip active={mode === 'write'} onPress={() => setMode('write')} Icon={PenLine} label="Write" />
          <ModeChip active={mode === 'speak'} onPress={() => setMode('speak')} Icon={Mic} label="Speak" />
          <ModeChip active={mode === 'video'} onPress={() => setMode('video')} Icon={Video} label="Record" />
        </View>

        {mode === 'write' && (
          <View className="mt-3">
            <SoftButton primary onPress={saveText}>
              Keep it
            </SoftButton>
          </View>
        )}
        {mode === 'speak' && (
          <View className="mt-3">
            <VoiceRecorder onSave={saveVoice} />
          </View>
        )}
        {mode === 'video' && (
          <View className="mt-3">
            <MiniVideoRecorder onSave={saveVideo} />
          </View>
        )}

        {!isGratitude && (
          <View className="mt-3.5 flex-row items-center gap-3 rounded-[16px] bg-accent-soft px-4 py-3.5">
            <Send size={20} color={colors.accentDeep} />
            <Text className="flex-1 font-body text-[13px] leading-[19px] text-accent-deep">
              Appreciation grows when it's spoken. Want to tell them?
            </Text>
            <SoftButton
              onPress={() => setSendEntry(recent[0] ?? { content: 'someone you value' })}
              className="bg-card px-3 py-2"
              raw
            >
              <Text className="font-body-extrabold text-[13px] text-accent-deep">Send it</Text>
            </SoftButton>
          </View>
        )}

        <View className="mt-6">
          <SectionLabel>The last few days</SectionLabel>
          {recent.length === 0 && (
            <EmptyNote>Nothing here yet — today's a lovely place to start.</EmptyNote>
          )}
          <View className="gap-2.5">
            {recent.map((entry) => (
              <EntryCard
                key={entry.id}
                e={entry}
                onShare={entry.type === 'text' ? () => shareEntry(entry) : undefined}
                onSend={
                  !isGratitude && entry.type === 'text'
                    ? () => setSendEntry(entry)
                    : undefined
                }
              />
            ))}
          </View>
        </View>

        <ArchiveBrowser years={years} kind={kind} />
      </View>

      {sendEntry && (
        <SendModal
          entry={sendEntry}
          visible={sendEntry !== null}
          onClose={() => setSendEntry(null)}
        />
      )}
    </Screen>
  );
}
