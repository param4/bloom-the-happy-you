import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SoftButton } from '@/components/ui/SoftButton';
import { haptics } from '@/lib/haptics';

interface PhotoCropModalProps {
  /** Source image URI to crop, or null when closed. */
  uri: string | null;
  onCancel: () => void;
  onSave: (croppedUri: string) => void;
}

function clampWorklet(v: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(v, min), max);
}

const ASPECT_W = 4;
const ASPECT_H = 3;
const MAX_ZOOM = 4;

/**
 * In-app 4:3 photo cropper. Replaces expo-image-picker's native crop UI, whose
 * confirm button is hidden behind the status bar under edge-to-edge in release
 * builds. Pan + pinch to frame the shot; the crop is applied with
 * expo-image-manipulator. Lives inside its own GestureHandlerRootView because
 * gestures inside an RN Modal need a root on Android.
 */
export function PhotoCropModal({ uri, onCancel, onSave }: PhotoCropModalProps) {
  const insets = useSafeAreaInsets();
  const win = useWindowDimensions();
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTy = useSharedValue(0);

  // Resolve the image's natural pixel size and reset the transform each time a
  // new photo is opened.
  useEffect(() => {
    if (!uri) {
      setNat(null);
      return;
    }
    let active = true;
    setNat(null);
    Image.getSize(
      uri,
      (w, h) => {
        if (!active) return;
        scale.value = 1;
        savedScale.value = 1;
        tx.value = 0;
        savedTx.value = 0;
        ty.value = 0;
        savedTy.value = 0;
        setNat({ w, h });
      },
      () => active && setNat(null),
    );
    return () => {
      active = false;
    };
  }, [uri, scale, savedScale, tx, savedTx, ty, savedTy]);

  // Frame is 4:3, as wide as the screen allows while leaving room for header
  // and the action buttons.
  const insetTop = insets.top;
  const insetBottom = insets.bottom;
  const maxFrameH = win.height - insetTop - insetBottom - 220;
  let frameW = win.width - 48;
  let frameH = (frameW * ASPECT_H) / ASPECT_W;
  if (frameH > maxFrameH) {
    frameH = maxFrameH;
    frameW = (frameH * ASPECT_W) / ASPECT_H;
  }

  // Base "cover" scale so the image always fills the frame at min zoom.
  const cover = nat ? Math.max(frameW / nat.w, frameH / nat.h) : 1;
  const baseW = nat ? nat.w * cover : frameW;
  const baseH = nat ? nat.h * cover : frameH;

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onUpdate((e) => {
        'worklet';
        const maxTx = Math.max(0, (baseW * scale.value - frameW) / 2);
        const maxTy = Math.max(0, (baseH * scale.value - frameH) / 2);
        tx.value = clampWorklet(savedTx.value + e.translationX, -maxTx, maxTx);
        ty.value = clampWorklet(savedTy.value + e.translationY, -maxTy, maxTy);
      })
      .onEnd(() => {
        'worklet';
        savedTx.value = tx.value;
        savedTy.value = ty.value;
      });

    const pinch = Gesture.Pinch()
      .onUpdate((e) => {
        'worklet';
        const s = clampWorklet(savedScale.value * e.scale, 1, MAX_ZOOM);
        scale.value = s;
        const maxTx = Math.max(0, (baseW * s - frameW) / 2);
        const maxTy = Math.max(0, (baseH * s - frameH) / 2);
        tx.value = clampWorklet(tx.value, -maxTx, maxTx);
        ty.value = clampWorklet(ty.value, -maxTy, maxTy);
      })
      .onEnd(() => {
        'worklet';
        savedScale.value = scale.value;
        savedTx.value = tx.value;
        savedTy.value = ty.value;
      });

    return Gesture.Simultaneous(pan, pinch);
  }, [baseW, baseH, frameW, frameH, scale, savedScale, tx, savedTx, ty, savedTy]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  const handleSave = async () => {
    if (!uri || !nat || busy) return;
    setBusy(true);
    try {
      const denom = cover * scale.value; // source px → screen px
      let cropW = frameW / denom;
      let cropH = frameH / denom;
      let cropX = nat.w / 2 + (-frameW / 2 - tx.value) / denom;
      let cropY = nat.h / 2 + (-frameH / 2 - ty.value) / denom;
      // Keep the crop rect inside the image bounds.
      cropW = Math.min(cropW, nat.w);
      cropH = Math.min(cropH, nat.h);
      cropX = Math.max(0, Math.min(cropX, nat.w - cropW));
      cropY = Math.max(0, Math.min(cropY, nat.h - cropH));

      const result = await manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: Math.round(cropX),
              originY: Math.round(cropY),
              width: Math.round(cropW),
              height: Math.round(cropH),
            },
          },
        ],
        { compress: 0.85, format: SaveFormat.JPEG },
      );
      haptics.success();
      onSave(result.uri);
    } catch {
      // Leave the modal open so the user can retry.
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={!!uri} transparent animationType="fade" onRequestClose={onCancel}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          className="flex-1 items-center justify-center bg-black"
          style={{ paddingTop: insetTop + 12, paddingBottom: insetBottom + 12 }}
        >
          <Text className="mb-1 font-serif text-lg text-white">Adjust your photo</Text>
          <Text className="mb-6 font-body text-[13px] text-white/70">
            Pinch to zoom, drag to reposition
          </Text>

          <View
            style={{
              width: frameW,
              height: frameH,
              borderRadius: 18,
              overflow: 'hidden',
              backgroundColor: '#111',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.85)',
            }}
          >
            {nat ? (
              <GestureDetector gesture={gesture}>
                <Animated.Image
                  source={{ uri: uri ?? undefined }}
                  resizeMode="cover"
                  style={[
                    {
                      position: 'absolute',
                      width: baseW,
                      height: baseH,
                      left: (frameW - baseW) / 2,
                      top: (frameH - baseH) / 2,
                    },
                    imageStyle,
                  ]}
                />
              </GestureDetector>
            ) : (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>

          <View className="mt-8 w-full flex-row gap-2.5 px-6">
            <SoftButton ghost onPress={onCancel} className="flex-1">
              Cancel
            </SoftButton>
            <SoftButton primary onPress={handleSave} disabled={busy || !nat} className="flex-1">
              {busy ? 'Saving…' : 'Save'}
            </SoftButton>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
