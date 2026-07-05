import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Video as VideoIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { SoftButton } from '@/components/ui/SoftButton';

type State = 'idle' | 'recording' | 'preview' | 'unavailable';

interface MiniVideoRecorderProps {
  /** uri is undefined when the camera isn't available (simulator / denied). */
  onSave: (uri?: string) => void;
}

/**
 * Compact video recorder for a pillar reflection. Degrades to a uri-less
 * "save reflection" path on simulators or when permission is denied.
 */
export function MiniVideoRecorder({ onSave }: MiniVideoRecorderProps) {
  const [state, setState] = useState<State>('idle');
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
    onSave(recordedUri ?? undefined);
    setRecordedUri(null);
    setState('idle');
  };

  return (
    <View>
      <View
        className="items-center justify-center overflow-hidden rounded-[16px]"
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
            <VideoIcon size={30} color="#fff" style={{ opacity: 0.8 }} />
            <Text className="mt-2 text-center font-body text-[13px] leading-5 text-white opacity-90">
              {state === 'unavailable'
                ? "Camera isn't available here — it works on your phone. You can still save this reflection."
                : 'Tap record to begin'}
            </Text>
          </View>
        )}
      </View>

      <View className="mt-2.5 flex-row gap-2.5">
        {state === 'idle' && (
          <SoftButton primary onPress={start} className="flex-1">
            Record
          </SoftButton>
        )}
        {state === 'recording' && (
          <SoftButton primary onPress={stop} className="flex-1 bg-accent-deep">
            Stop
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
          <SoftButton primary onPress={() => onSave(undefined)} className="flex-1">
            Save reflection
          </SoftButton>
        )}
      </View>
    </View>
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
