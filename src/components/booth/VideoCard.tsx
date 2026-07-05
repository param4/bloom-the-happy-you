import { useVideoPlayer, VideoView } from 'expo-video';
import { Download, Play } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { GradientCard } from '@/components/ui/GradientCard';
import type { JoyVideo } from '@/domain/video';
import { fmtDay } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';

interface VideoCardProps {
  video: JoyVideo;
  onOpenShare(video: JoyVideo): void;
}

/** One booth clip (or gradient placeholder for joy notes / seed data). */
export function VideoCard({ video, onOpenShare }: VideoCardProps) {
  const { colors, gradients } = useTheme();
  return (
    <Card bordered className="flex-1 overflow-hidden rounded-[18px]">
      {video.uri ? (
        <ClipThumb uri={video.uri} />
      ) : (
        <GradientCard
          colors={gradients.heroBadge}
          direction="diagonal"
          className="h-24 items-center justify-center"
        >
          <Play size={26} color={colors.accentDeep} fill={colors.accentDeep} />
        </GradientCard>
      )}
      <View className="p-2.5">
        <Text className="font-serif text-[14px] leading-4 text-ink">{video.label}</Text>
        <Text className="mt-0.5 font-body text-[11px] text-ink-soft">{fmtDay(video.dateKey)}</Text>
        <Pressable
          onPress={() => onOpenShare(video)}
          className="mt-2 flex-row items-center justify-center gap-1 rounded-[10px] border border-line bg-accent-soft py-1.5"
        >
          <Download size={13} color={colors.accentDeep} />
          <Text className="font-body-extrabold text-[11px] text-accent-deep">Save / Share</Text>
        </Pressable>
      </View>
    </Card>
  );
}

function ClipThumb({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return (
    <View className="h-24" style={{ backgroundColor: '#2b2620' }}>
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        nativeControls
      />
    </View>
  );
}
