import { useVideoPlayer, VideoView } from 'expo-video';
import { Check, Play, Share2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { GradientCard } from '@/components/ui/GradientCard';
import type { JoyVideo } from '@/domain/video';
import { fmtDay } from '@/lib/dates';
import { colors } from '@/theme/colors';
import { colorToCream } from '@/theme/gradients';

interface VideoCardProps {
  video: JoyVideo;
  onToggleShared(): void;
}

/** One booth clip (or gradient placeholder for joy notes / seed data). */
export function VideoCard({ video, onToggleShared }: VideoCardProps) {
  return (
    <Card className="flex-1 overflow-hidden rounded-[18px]">
      {video.uri ? (
        <ClipThumb uri={video.uri} />
      ) : (
        <GradientCard
          colors={colorToCream(video.color)}
          className="h-24 items-center justify-center"
        >
          <Play size={26} color="#fff" fill="#fff" />
        </GradientCard>
      )}
      <View className="p-2.5">
        <Text className="font-display text-[13px] leading-4 text-ink">{video.label}</Text>
        <Text className="mt-0.5 font-body text-[11px] text-ink-soft">{fmtDay(video.dateKey)}</Text>
        <Pressable
          onPress={onToggleShared}
          className={`mt-2 flex-row items-center justify-center gap-1 rounded-[10px] border py-1.5 ${
            video.shared ? 'border-sage bg-sage-light' : 'border-line bg-transparent'
          }`}
        >
          {video.shared ? (
            <>
              <Check size={13} color={colors.sageDeep} />
              <Text className="font-display text-[11px] text-sage-deep">Shared</Text>
            </>
          ) : (
            <>
              <Share2 size={13} color={colors.inkSoft} />
              <Text className="font-display text-[11px] text-ink-soft">Keep private</Text>
            </>
          )}
        </Pressable>
      </View>
    </Card>
  );
}

function ClipThumb({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return (
    <View className="h-24" style={{ backgroundColor: '#2b2822' }}>
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        nativeControls
      />
    </View>
  );
}
