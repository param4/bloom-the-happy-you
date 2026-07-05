import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { GlowView } from '@/components/ui/GlowView';
import { GradientCard } from '@/components/ui/GradientCard';
import { ModalCard } from '@/components/ui/ModalCard';
import { SoftButton } from '@/components/ui/SoftButton';
import type { Manifestation } from '@/domain/manifestation';
import { useServices } from '@/providers/ServicesProvider';
import { colors } from '@/theme/colors';
import { hueToWhite } from '@/theme/gradients';

/** The glowing manifestation-moment card. */
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
      <Animated.View entering={ZoomIn.springify().damping(14)} className="items-center">
        {dream === null ? (
          <>
            <Text className="my-4 text-center font-body text-base leading-6 text-ink">
              Every dream on your board has come true — or your board is waiting for its first
              one. Add what you're calling in.
            </Text>
          </>
        ) : (
          <>
            <GlowView className="mb-4 w-full" style={{ borderRadius: 22 }} durationMs={3500}>
              <GradientCard
                colors={hueToWhite(dream.hue)}
                direction="steep"
                className="h-[190px] w-full items-center justify-center rounded-[22px]"
              >
                <Sparkles size={44} color={colors.peachDeep} />
              </GradientCard>
            </GlowView>

            <Text className="font-display text-xs uppercase tracking-widest text-peach-deep">
              Your manifestation moment
            </Text>
            <Text className="my-2.5 text-center font-display text-[22px] leading-[30px] text-ink">
              {dream.affirmation}
            </Text>
            <Text className="text-center font-body text-sm text-ink-soft">
              Breathe. Read it aloud. Let it feel true.
            </Text>
          </>
        )}

        <SoftButton primary onPress={() => router.back()} className="mt-4 min-w-[160px]">
          I feel it
        </SoftButton>
      </Animated.View>
    </ModalCard>
  );
}
