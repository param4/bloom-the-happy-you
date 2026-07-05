import { useState } from 'react';
import { View } from 'react-native';

import { BrandedVideoModal } from '@/components/booth/BrandedVideoModal';
import { VideoCard } from '@/components/booth/VideoCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { JoyVideo } from '@/domain/video';

interface VideoGalleryProps {
  videos: JoyVideo[];
}

/** Two-column grid of booth moments; each opens a branded save/share frame. */
export function VideoGallery({ videos }: VideoGalleryProps) {
  const [frameVid, setFrameVid] = useState<JoyVideo | null>(null);

  const rows: JoyVideo[][] = [];
  for (let i = 0; i < videos.length; i += 2) rows.push(videos.slice(i, i + 2));

  return (
    <View className="mt-6">
      <SectionLabel>Your booth of happy moments</SectionLabel>
      <View className="gap-3">
        {rows.map((row, i) => (
          <View key={i} className="flex-row gap-3">
            {row.map((video) => (
              <VideoCard key={video.id} video={video} onOpenShare={setFrameVid} />
            ))}
            {row.length === 1 && <View className="flex-1" />}
          </View>
        ))}
      </View>

      <BrandedVideoModal video={frameVid} onClose={() => setFrameVid(null)} />
    </View>
  );
}
