import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Mic } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { GlowView } from '@/components/ui/GlowView';
import { SoftButton } from '@/components/ui/SoftButton';
import { useTheme } from '@/theme/ThemeProvider';

interface VoiceRecorderProps {
  /** Called with the recording's durable-ish cache uri (or undefined on fallback). */
  onSave: (uri?: string) => void;
}

type State = 'idle' | 'rec' | 'done' | 'error';

const pad = (n: number) => `${n}`.padStart(2, '0');

/** Voice-note recorder (expo-audio) with a running mm:ss timer + glow. */
export function VoiceRecorder({ onSave }: VoiceRecorderProps) {
  const { colors } = useTheme();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 500);
  const [state, setState] = useState<State>('idle');
  const [uri, setUri] = useState<string | undefined>();

  const secs = Math.floor((recorderState.durationMillis ?? 0) / 1000);
  const timer = `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;

  const start = async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) return setState('error');
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setState('rec');
    } catch {
      setState('error');
    }
  };

  const stop = async () => {
    try {
      await recorder.stop();
      setUri(recorder.uri ?? undefined);
    } catch {
      // keep whatever uri we have
    }
    setState('done');
  };

  if (state === 'error') {
    return (
      <View className="items-center rounded-2xl border border-line bg-card p-[18px]">
        <Text className="mb-3 text-center font-body text-[13px] text-ink-soft">
          Microphone isn’t available right now — on your phone it records normally. You can still
          save a voice note.
        </Text>
        <SoftButton primary onPress={() => onSave(undefined)} className="w-full">
          Save voice note
        </SoftButton>
      </View>
    );
  }

  return (
    <View className="items-center rounded-2xl border border-line bg-card p-[18px]">
      <GlowView
        className="mb-3 h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: state === 'rec' ? colors.accent : colors.accentSoft }}
      >
        <Mic size={28} color={state === 'rec' ? '#fff' : colors.accentDeep} />
      </GlowView>
      <Text className="mb-3 font-serif text-[20px] text-ink">
        {state === 'rec' ? timer : state === 'done' ? "Lovely — that's kept 💛" : 'Speak freely'}
      </Text>
      {state === 'idle' && (
        <SoftButton primary onPress={start} className="w-full">
          Start recording
        </SoftButton>
      )}
      {state === 'rec' && (
        <SoftButton primary onPress={stop} className="w-full bg-accent-deep">
          Stop
        </SoftButton>
      )}
      {state === 'done' && (
        <SoftButton primary onPress={() => onSave(uri)} className="w-full">
          Keep it
        </SoftButton>
      )}
    </View>
  );
}
