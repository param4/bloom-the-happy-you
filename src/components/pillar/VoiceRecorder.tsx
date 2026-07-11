import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import * as Device from 'expo-device';
import { Mic, Pause, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Text, View } from 'react-native';

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
  const [playing, setPlaying] = useState(false);
  const player = useAudioPlayer(uri ?? undefined);

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

  const discard = () => {
    if (playing) {
      player.pause();
      setPlaying(false);
    }
    setUri(undefined);
    setState('idle');
  };

  const togglePlay = async () => {
    if (!uri) return;
    if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      // Recording left the mic (earpiece) route active; switch to loud playback.
      try {
        await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
      } catch {
        // best-effort — play anyway
      }
      try {
        player.seekTo(0);
      } catch {
        // fresh player — nothing to rewind
      }
      player.play();
      setPlaying(true);
    }
  };

  if (state === 'error') {
    return (
      <View className="items-center rounded-2xl border border-line bg-card p-[18px]">
        <Text className="mb-3 text-center font-body text-[13px] text-ink-soft">
          {Device.isDevice
            ? "Bloom couldn't reach the microphone. Check Microphone access in Settings, or save a note without audio."
            : 'Microphone isn’t available here — on your phone it records normally. You can still save a voice note.'}
        </Text>
        <View className="w-full gap-2">
          {Device.isDevice && (
            <>
              {/* Re-requests permission, so it recovers once access is granted. */}
              <SoftButton primary onPress={start} className="w-full">
                Try again
              </SoftButton>
              <SoftButton ghost onPress={() => Linking.openSettings()} className="w-full">
                Open Settings
              </SoftButton>
            </>
          )}
          <SoftButton
            primary={!Device.isDevice}
            onPress={() => onSave(undefined)}
            className={`w-full ${Device.isDevice ? 'bg-cream' : ''}`}
          >
            Save voice note
          </SoftButton>
        </View>
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
        {state === 'rec' ? timer : state === 'done' ? 'How does it sound?' : 'Speak freely'}
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
        <View className="w-full gap-2">
          {uri && (
            <SoftButton raw onPress={togglePlay} className="w-full">
              {playing ? (
                <Pause size={16} color={colors.accentDeep} />
              ) : (
                <Play size={16} color={colors.accentDeep} />
              )}
              <Text className="font-body-extrabold text-[13px] text-accent-deep">
                {playing ? 'Pause' : 'Play it back'}
              </Text>
            </SoftButton>
          )}
          <SoftButton primary onPress={() => onSave(uri)} className="w-full">
            Keep it
          </SoftButton>
          <SoftButton onPress={discard} className="w-full bg-cream">
            Discard
          </SoftButton>
        </View>
      )}
    </View>
  );
}
