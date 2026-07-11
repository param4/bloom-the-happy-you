import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { Camera, Check, Video as VideoIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Linking, Pressable, Text, TextInput, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { Card } from '@/components/ui/Card';
import { SoftButton } from '@/components/ui/SoftButton';
import { useTheme } from '@/theme/ThemeProvider';

/** 'denied' = a real device without camera/mic access; 'unavailable' = no
 *  camera hardware at all (simulator). The copy must not confuse the two. */
type StageState = 'idle' | 'recording' | 'preview' | 'denied' | 'unavailable';

interface CameraStageProps {
  /** uri is undefined for placeholder "joy notes" (no camera available). */
  onSave(label: string, uri?: string): void;
  /** Heading + blurb — defaults to the Joy Booth wording. */
  title?: string;
  subtitle?: string;
}

/**
 * The Joy Booth recorder, reused for pillar video reflections. On simulators /
 * denied permission it degrades to the prototype's "save a joy note" path
 * instead of failing.
 */
export function CameraStage({
  onSave,
  title = 'Capture a happy moment',
  subtitle = "A message from today's you to a future, low-day you.",
}: CameraStageProps) {
  const { colors } = useTheme();
  const [state, setState] = useState<StageState>('idle');
  const [label, setLabel] = useState('');
  const [highQuality, setHighQuality] = useState(true);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const start = async () => {
    if (!Device.isDevice) return setState('unavailable');
    const cam = cameraPermission?.granted || (await requestCameraPermission()).granted;
    const mic = micPermission?.granted || (await requestMicPermission()).granted;
    if (!cam || !mic) return setState('denied');
    setRecordedUri(null);
    setState('recording');
  };

  const onCameraReady = async () => {
    try {
      // Codec is required on iOS for the CameraView videoBitrate to take effect.
      const result = await cameraRef.current?.recordAsync(
        highQuality ? { maxDuration: 180, codec: 'avc1' } : { maxDuration: 180 },
      );
      if (result?.uri) {
        setRecordedUri(result.uri);
        setState('preview');
      } else {
        setState('idle');
      }
    } catch {
      // Recording was interrupted (backgrounded, call, permission revoked…).
      setState(Device.isDevice ? 'denied' : 'unavailable');
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
      <Text className="font-serif text-[18px] text-ink">{title}</Text>
      <Text className="mb-3 font-body text-[13px] text-ink-soft">{subtitle}</Text>

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
              videoQuality={highQuality ? '1080p' : undefined}
              videoBitrate={highQuality ? 8_000_000 : undefined}
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
            {state === 'denied' ? (
              <>
                <Camera size={34} color="#fff" style={{ opacity: 0.8 }} />
                <Text className="mt-2 text-center font-body text-[13px] leading-5 text-white opacity-90">
                  Bloom couldn’t reach the camera. Check Camera and Microphone access in
                  Settings, or save a joy note instead.
                </Text>
              </>
            ) : state === 'unavailable' ? (
              <>
                <Camera size={34} color="#fff" style={{ opacity: 0.8 }} />
                <Text className="mt-2 text-center font-body text-[13px] leading-5 text-white opacity-90">
                  Camera isn’t available here. On your phone it records normally — for now you
                  can save a joy note.
                </Text>
              </>
            ) : (
              <>
                <VideoIcon size={34} color="#fff" style={{ opacity: 0.8 }} />
                <Text className="mt-2 font-body text-[13px] text-white opacity-90">
                  Tap record when you’re ready
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

      {state === 'idle' && (
        <Pressable
          onPress={() => setHighQuality((v) => !v)}
          accessibilityRole="switch"
          accessibilityState={{ checked: highQuality }}
          className="mt-3 flex-row items-center gap-2.5"
        >
          <View
            className={`h-5 w-5 items-center justify-center rounded-md border ${
              highQuality ? 'border-accent bg-accent' : 'border-line bg-transparent'
            }`}
          >
            {highQuality && <Check size={14} color="#fff" />}
          </View>
          <View className="flex-1">
            <Text className="font-body-extrabold text-[14px] text-ink">High quality (HD)</Text>
            <Text className="font-body text-[12px] text-ink-soft">
              Sharper video, larger file. Turn off to save space.
            </Text>
          </View>
        </Pressable>
      )}

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
        {state === 'denied' && (
          <View className="flex-1 gap-2.5">
            <View className="flex-row gap-2.5">
              {/* Re-requests permission, so it recovers once access is granted. */}
              <SoftButton primary onPress={start} className="flex-1">
                Try again
              </SoftButton>
              <SoftButton ghost onPress={() => Linking.openSettings()} className="flex-1">
                Open Settings
              </SoftButton>
            </View>
            <SoftButton onPress={saveJoyNote} className="bg-cream">
              Save a joy note
            </SoftButton>
          </View>
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
