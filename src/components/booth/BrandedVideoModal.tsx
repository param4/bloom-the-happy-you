import { useVideoPlayer, VideoView } from 'expo-video';
import { Download, Flower2, Play, Share2 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { OverlayModal } from '@/components/ui/OverlayModal';
import { SoftButton } from '@/components/ui/SoftButton';
import type { JoyVideo } from '@/domain/video';
import { fmtDay } from '@/lib/dates';
import { captureAndShare, shareFile } from '@/lib/share';
import { useToastStore } from '@/state/toastStore';
import { useTheme } from '@/theme/ThemeProvider';

interface BrandedVideoModalProps {
  video: JoyVideo | null;
  onClose(): void;
}

/** Wraps a booth moment in a shareable "Bloom" frame — download or share. */
export function BrandedVideoModal({ video, onClose }: BrandedVideoModalProps) {
  const { colors, gradients } = useTheme();
  const frameRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!video || busy) return;
    setBusy(true);
    try {
      if (video.uri) await shareFile(video.uri, 'video/mp4');
      else await captureAndShare(frameRef, 'bloom-moment');
      useToastStore.getState().flash('Saved with your Bloom frame 💛');
    } catch {
      // sharing was cancelled or unavailable — no-op
    } finally {
      setBusy(false);
    }
  };

  return (
    <OverlayModal visible={!!video} onClose={onClose}>
      {video && (
        <>
          <Text className="font-serif text-[22px] text-ink">Your moment, framed</Text>
          <Text className="mb-4 mt-1 font-body text-[13px] text-ink-soft">
            Wrapped in Bloom — download it or share it, it's yours.
          </Text>

          <View ref={frameRef} collapsable={false}>
            <GradientCard
              colors={gradients.heroBadge}
              direction="steep"
              className="overflow-hidden rounded-[22px] border border-line p-4"
            >
              <View className="mb-3 flex-row items-center gap-2">
                <Flower2 size={22} color={colors.accent} />
                <Text className="font-serif text-[18px] leading-none text-ink">Bloom</Text>
              </View>

              <View
                className="items-center justify-center overflow-hidden rounded-[16px]"
                style={{ aspectRatio: 4 / 5, backgroundColor: '#2b2620' }}
              >
                {video.uri ? (
                  <FramePreview uri={video.uri} />
                ) : (
                  <Play size={44} color="#fff" fill="#fff" />
                )}
              </View>

              <View className="mt-3 flex-row items-center justify-between">
                <Text className="font-serif-italic text-[14px] text-ink-soft">
                  meet the happy you
                </Text>
                <Text className="font-body-extrabold text-[12px] text-accent-deep">
                  {fmtDay(video.dateKey)}
                </Text>
              </View>
              <Text className="mt-2 font-serif text-[16px] text-ink">{video.label}</Text>
            </GradientCard>
          </View>

          <View className="mt-4 flex-row gap-2.5">
            <SoftButton primary onPress={run} disabled={busy} className="flex-1" raw>
              <Download size={16} color="#fff" />
              <Text className="font-body-extrabold text-[15px] text-white">
                {busy ? 'Preparing…' : 'Download'}
              </Text>
            </SoftButton>
            <SoftButton ghost onPress={run} disabled={busy} raw>
              <Share2 size={16} color={colors.ink} />
              <Text className="font-body-extrabold text-[15px] text-ink">Share</Text>
            </SoftButton>
          </View>
        </>
      )}
    </OverlayModal>
  );
}

function FramePreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      nativeControls
    />
  );
}
