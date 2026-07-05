import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { Camera, Video as VideoIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { Card } from '@/components/ui/Card';
import { SoftButton } from '@/components/ui/SoftButton';
import { useTheme } from '@/theme/ThemeProvider';

type StageState = 'idle' | 'recording' | 'preview' | 'unavailable';

interface CameraStageProps {
  /** uri is undefined for placeholder "joy notes" (no camera available). */
  onSave(label: string, uri?: string): void;
}

/**
 * The Joy Booth recorder. On simulators / denied permission it degrades to
 * the prototype's "save a joy note" path instead of failing.
 */
export function CameraStage({ onSave }: CameraStageProps) {
  const { colors } = useTheme();
  const [state, setState] = useState<StageState>('idle');
  const [label, setLabel] = useState('');
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const start = async () => {
    if (!Device.isDevice) return setState('unavailable');
    const cam = cameraPermission?.granted || (await requestCameraPermission()).granted;
    const mic = micPermission?.granted || (await requestMicPermission()).granted;
    if (!cam || !mic) return setState('unavailable');
    setRecordedUri(null);
    setState('recording');
  };

  const onCameraReady = async () => {
    try {
      const result = await cameraRef.current?.recordAsync({ maxDuration: 180 });
      if (result?.uri) {
        setRecordedUri(result.uri);
        setState('preview');
      } else {
        setState('idle');
      }
    } catch {
      setState('unavailable');
    }
  };

  const stop = () => cameraRef.current?.stopRecording();

  const keep = () => {
    onSave(label, recordedUri ?? undefined);
    setLabel('');
    setRecordedUri(null);
    setState('idle');
  };

  const saveJoyNote = () => {
    onSave(label);
    setLabel('');
    setState('idle');
  };

  return (
    <Card bordered className="p-4">
      <Text className="font-serif text-[18px] text-ink">Capture a happy moment</Text>
      <Text className="mb-3 font-body text-[13px] text-ink-soft">
        A message from today's you to a future, low-day you.
      </Text>

      <View
        className="items-center justify-center overflow-hidden rounded-[18px]"
        style={{ aspectRatio: 4 / 3, backgroundColor: '#2b2620' }}
      >
        {state === 'recording' ? (
          <>
            <CameraView
              ref={cameraRef}
              facing="front"
              mode="video"
              onCameraReady={onCameraReady}
              style={{ width: '100%', height: '100%' }}
            />
            <View className="absolute left-3 top-3 flex-row items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1">
              <View className="h-2 w-2 rounded-full bg-[#ff6b6b]" />
              <Text className="font-body-bold text-xs text-white">REC</Text>
            </View>
          </>
        ) : state === 'preview' && recordedUri ? (
          <RecordingPreview uri={recordedUri} />
        ) : (
          <View className="items-center px-5">
            {state === 'unavailable' ? (
              <>
                <Camera size={34} color="#fff" style={{ opacity: 0.8 }} />
                <Text className="mt-2 text-center font-body text-[13px] leading-5 text-white opacity-90">
                  Camera isn't available here. On your phone it records normally — for now you
                  can save a joy note.
                </Text>
              </>
            ) : (
              <>
                <VideoIcon size={34} color="#fff" style={{ opacity: 0.8 }} />
                <Text className="mt-2 font-body text-[13px] text-white opacity-90">
                  Tap record when you're ready
                </Text>
              </>
            )}
          </View>
        )}
      </View>

      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder="Name this moment…"
        placeholderTextColor={colors.inkSoft}
        className="mt-3 rounded-xl border border-line bg-cream px-3 py-2.5 font-body text-[15px] text-ink"
      />

      <View className="mt-3 flex-row gap-2.5">
        {state === 'idle' && (
          <SoftButton primary onPress={start} className="flex-1" raw>
            <Camera size={18} color="#fff" />
            <Text className="font-body-extrabold text-[15px] text-white">Record</Text>
          </SoftButton>
        )}
        {state === 'recording' && (
          <SoftButton primary onPress={stop} className="flex-1 bg-accent-deep">
            Stop & keep
          </SoftButton>
        )}
        {state === 'preview' && (
          <>
            <SoftButton primary onPress={keep} className="flex-1">
              Keep it
            </SoftButton>
            <SoftButton
              ghost
              onPress={() => {
                setRecordedUri(null);
                setState('idle');
              }}
            >
              Retake
            </SoftButton>
          </>
        )}
        {state === 'unavailable' && (
          <SoftButton primary onPress={saveJoyNote} className="flex-1">
            Save a joy note
          </SoftButton>
        )}
      </View>
    </Card>
  );
}

function RecordingPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.play();
  });
  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      nativeControls
    />
  );
}
