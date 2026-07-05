import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { SoftButton } from '@/components/ui/SoftButton';
import { shadows } from '@/theme/shadows';

type RecorderState = 'idle' | 'recording' | 'done' | 'error';

interface MiniRecorderProps {
  /** Called with the recording's temp URI (undefined when unavailable). */
  onSave(uri?: string): void;
  onCancel(): void;
}

/**
 * Small in-composer recorder for spoken reflections. On simulators or when
 * permission is denied it falls back to saving a text reflection, matching
 * the prototype's graceful `camError` path.
 */
export function MiniRecorder({ onSave, onCancel }: MiniRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle');
  const [uri, setUri] = useState<string | undefined>();
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const start = async () => {
    if (!Device.isDevice) return setState('error');
    const cam = cameraPermission?.granted || (await requestCameraPermission()).granted;
    const mic = micPermission?.granted || (await requestMicPermission()).granted;
    if (!cam || !mic) return setState('error');
    setState('recording');
  };

  const onCameraReady = async () => {
    try {
      const result = await cameraRef.current?.recordAsync({ maxDuration: 120 });
      // recordAsync resolves when stopRecording() is called (or maxDuration).
      setUri(result?.uri);
      setState('done');
    } catch {
      setState('error');
    }
  };

  const stop = () => cameraRef.current?.stopRecording();

  return (
    <View className="mt-3.5">
      <View
        className="items-center justify-center overflow-hidden rounded-2xl"
        style={{ aspectRatio: 4 / 3, backgroundColor: '#2b2822' }}
      >
        {state === 'recording' ? (
          <CameraView
            ref={cameraRef}
            facing="front"
            mode="video"
            onCameraReady={onCameraReady}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Text className="px-4 py-4 text-center font-body text-[13px] text-white opacity-90">
            {state === 'error'
              ? 'Camera isn’t available here — you can still keep this reflection.'
              : state === 'done'
                ? 'Looks lovely 💛'
                : 'Tap record to begin'}
          </Text>
        )}
        {state === 'recording' && <RecBadge />}
      </View>

      <View className="mt-2.5 flex-row gap-2.5">
        {state === 'idle' && (
          <SoftButton primary onPress={start} className="flex-1">
            Record
          </SoftButton>
        )}
        {state === 'recording' && (
          <SoftButton
            primary
            onPress={stop}
            className="flex-1 bg-lav-deep"
            style={shadows.lavGlow}
          >
            Stop
          </SoftButton>
        )}
        {(state === 'done' || state === 'error') && (
          <SoftButton primary onPress={() => onSave(uri)} className="flex-1">
            Keep it
          </SoftButton>
        )}
        <SoftButton onPress={onCancel}>Cancel</SoftButton>
      </View>
    </View>
  );
}

function RecBadge() {
  return (
    <View className="absolute left-3 top-3 flex-row items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1">
      <View className="h-2 w-2 rounded-full bg-[#ff6b6b]" />
      <Text className="font-body-bold text-xs text-white">REC</Text>
    </View>
  );
}
