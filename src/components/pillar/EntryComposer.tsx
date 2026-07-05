import { PenLine, Video } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SoftButton } from '@/components/ui/SoftButton';
import type { EntryDraft } from '@/state/entriesStore';
import { colors } from '@/theme/colors';

import { MiniRecorder } from './MiniRecorder';

type ComposerMode = 'write' | 'record' | null;

interface EntryComposerProps {
  prompt: string;
  onAdd(draft: EntryDraft): void;
}

/** Today's entry composer — write it or record it, whichever feels easy. */
export function EntryComposer({ prompt, onAdd }: EntryComposerProps) {
  const [mode, setMode] = useState<ComposerMode>(null);
  const [text, setText] = useState('');

  const saveText = () => {
    if (!text.trim()) return;
    onAdd({ type: 'text', content: text.trim() });
    setText('');
    setMode(null);
  };

  const saveRecording = (uri?: string) => {
    onAdd({ type: 'video', content: 'A recorded reflection', videoUri: uri });
    setMode(null);
  };

  return (
    <Card className="p-[18px]">
      <Text className="font-display text-lg text-ink">{prompt}</Text>
      <Text className="mt-0.5 font-body text-[13px] text-ink-soft">
        Write it, or record it — whichever feels easy today.
      </Text>

      {mode === null && (
        <View className="mt-3.5 flex-row gap-2.5">
          <SoftButton onPress={() => setMode('write')} className="flex-1" raw>
            <PenLine size={18} color={colors.ink} />
            <Text className="font-display text-[15px] text-ink">Write it</Text>
          </SoftButton>
          <SoftButton onPress={() => setMode('record')} className="flex-1" raw>
            <Video size={18} color={colors.ink} />
            <Text className="font-display text-[15px] text-ink">Record it</Text>
          </SoftButton>
        </View>
      )}

      {mode === 'write' && (
        <View className="mt-3.5">
          <TextInput
            value={text}
            onChangeText={setText}
            autoFocus
            multiline
            numberOfLines={3}
            placeholder="In your own words…"
            placeholderTextColor={colors.inkSoft}
            className="min-h-[88px] rounded-2xl border border-line bg-cream p-3.5 font-body text-base text-ink"
            textAlignVertical="top"
          />
          <View className="mt-2.5 flex-row gap-2.5">
            <SoftButton primary onPress={saveText} className="flex-1">
              Keep it
            </SoftButton>
            <SoftButton
              onPress={() => {
                setMode(null);
                setText('');
              }}
            >
              Cancel
            </SoftButton>
          </View>
        </View>
      )}

      {mode === 'record' && (
        <MiniRecorder onSave={saveRecording} onCancel={() => setMode(null)} />
      )}
    </Card>
  );
}
