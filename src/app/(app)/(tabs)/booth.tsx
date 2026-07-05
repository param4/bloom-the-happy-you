import { View } from 'react-native';

import { CameraStage } from '@/components/booth/CameraStage';
import { PrivacyNote } from '@/components/booth/PrivacyNote';
import { VideoCard } from '@/components/booth/VideoCard';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TopBar } from '@/components/ui/TopBar';
import { haptics } from '@/lib/haptics';
import { useServices } from '@/providers/ServicesProvider';
import { useToastStore } from '@/state/toastStore';
import { useVideosStore } from '@/state/videosStore';
import { colors } from '@/theme/colors';

export default function BoothScreen() {
  const { media } = useServices();
  const videos = useVideosStore((s) => s.videos);
  const addVideo = useVideosStore((s) => s.add);
  const toggleShared = useVideosStore((s) => s.toggleShared);
  const flash = useToastStore((s) => s.flash);

  const onSave = async (label: string, tempUri?: string) => {
    // Recordings land in the volatile cache — copy to app storage first.
    const uri = tempUri ? await media.persistVideo(tempUri) : undefined;
    await addVideo(label, uri);
    haptics.success();
    flash(uri ? 'Kept for your future self 💛' : 'Saved a joy note for today 💛');
  };

  // two-column gallery rows
  const rows: (typeof videos)[] = [];
  for (let i = 0; i < videos.length; i += 2) rows.push(videos.slice(i, i + 2));

  return (
    <Screen padBottom={48}>
      <TopBar title="Joy Booth" tint={colors.peachDeep} />
      <View className="px-5">
        <PrivacyNote />

        <CameraStage onSave={onSave} />

        <View className="mt-6">
          <SectionLabel>Your booth of happy moments</SectionLabel>
          <View className="gap-3">
            {rows.map((row, i) => (
              <View key={i} className="flex-row gap-3">
                {row.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onToggleShared={() => toggleShared(video.id)}
                  />
                ))}
                {row.length === 1 && <View className="flex-1" />}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}
