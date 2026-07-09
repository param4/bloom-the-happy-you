import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { ModalCard } from '@/components/ui/ModalCard';
import { SoftButton } from '@/components/ui/SoftButton';
import { DreamDetails } from '@/components/vision/DreamDetails';
import type { Manifestation } from '@/domain/manifestation';
import { useServices } from '@/providers/ServicesProvider';

/** The glowing manifestation-moment card — a random dream shown as an affirmation. */
export default function ManifestationMomentModal() {
  const router = useRouter();
  const { moment } = useServices();
  const [dream, setDream] = useState<Manifestation | null | 'loading'>('loading');

  useEffect(() => {
    moment.pickActiveDream().then(setDream);
  }, [moment]);

  if (dream === 'loading') return <ModalCard dim>{null}</ModalCard>;

  return (
    <ModalCard dim>
      <Animated.View entering={ZoomIn.springify().damping(14)} className="w-full">
        {dream === null ? (
          <Text className="my-4 text-center font-body text-base leading-6 text-ink">
            Every dream on your board has come true — or your board is waiting for its first
            one. Add what you’re calling in.
          </Text>
        ) : (
          <>
            <Text className="mb-3 text-center font-body-extrabold text-xs uppercase tracking-widest text-accent-deep">
              Your manifestation moment
            </Text>

            <DreamDetails dream={dream} glow />

            <Text className="mt-4 text-center font-body text-sm text-ink-soft">
              Breathe. Read it aloud. Let it feel true.
            </Text>
          </>
        )}

        <View className="items-center">
          <SoftButton primary onPress={() => router.back()} className="mt-4 min-w-[160px]">
            I feel it
          </SoftButton>
        </View>
      </Animated.View>
    </ModalCard>
  );
}
