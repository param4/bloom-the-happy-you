import { View } from 'react-native';

import { CameraStage } from '@/components/booth/CameraStage';
import { PrivacyNote } from '@/components/booth/PrivacyNote';
import { VideoGallery } from '@/components/booth/VideoGallery';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/ui/TopBar';
import { haptics } from '@/lib/haptics';
import { useServices } from '@/providers/ServicesProvider';
import { useToastStore } from '@/state/toastStore';
import { useVideosStore } from '@/state/videosStore';

export default function BoothScreen() {
  const { media } = useServices();
  const videos = useVideosStore((s) => s.videos);
  const addVideo = useVideosStore((s) => s.add);
  const flash = useToastStore((s) => s.flash);

  const onSave = async (label: string, tempUri?: string) => {
    // Recordings land in the volatile cache — copy to app storage first.
    const uri = tempUri ? await media.persistVideo(tempUri) : undefined;
    await addVideo(label, uri);
    haptics.success();
    flash(uri ? 'Kept for your future self 💛' : 'Saved a joy note for today 💛');
  };

  return (
    <Screen padBottom={48}>
      <TopBar title="Joy Booth" />
      <View className="px-5">
        <PrivacyNote />

        <CameraStage onSave={onSave} />

        <VideoGallery videos={videos} />
      </View>
    </Screen>
  );
}
