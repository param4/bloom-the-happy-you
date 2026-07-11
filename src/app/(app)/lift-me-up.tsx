import { Play } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { GlowView } from '@/components/ui/GlowView';
import { GradientCard } from '@/components/ui/GradientCard';
import { ModalCard } from '@/components/ui/ModalCard';
import { SoftButton } from '@/components/ui/SoftButton';
import { useRouter } from 'expo-router';
import type { ResurfaceItem } from '@/domain/resurface';
import { daysBetween } from '@/lib/dates';
import { useServices } from '@/providers/ServicesProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Resurfacing modal — "here's you, N days ago, feeling good." */
export default function LiftMeUpModal() {
  const router = useRouter();
  const { gradients } = useTheme();
  const { resurface } = useServices();
  const [item, setItem] = useState<ResurfaceItem | null | 'loading'>('loading');

  useEffect(() => {
    resurface.pickHappyMoment().then(setItem);
  }, [resurface]);

  if (item === 'loading') return <ModalCard>{null}</ModalCard>;

  const dateKey = item?.kind === 'video' ? item.video.dateKey : item?.entry.dateKey;

  return (
    <ModalCard>
      <View className="items-center">
        <Text className="font-body-extrabold text-[13px] uppercase tracking-widest text-accent-deep">
          A little light for right now
        </Text>

        {item === null ? (
          <Text className="my-4 text-center font-body text-base leading-6 text-ink">
            Your happy moments will gather here as you write and record them. Today is a lovely
            day to add the first one.
          </Text>
        ) : (
          <>
            <Text className="my-3 text-center font-serif text-[24px] leading-8 text-ink">
              Here’s you, {daysBetween(dateKey!)} days ago, feeling good.
            </Text>

            {item.kind === 'video' ? (
              <GlowView className="w-full" style={{ borderRadius: 20 }}>
                <GradientCard
                  colors={gradients.lift}
                  className="h-[180px] w-full items-center justify-center gap-2 rounded-[20px]"
                >
                  <Play size={40} color="#fff" fill="#fff" />
                  <Text className="font-serif text-base text-white">{item.video.label}</Text>
                </GradientCard>
              </GlowView>
            ) : (
              <View className="w-full rounded-[20px] bg-accent-soft p-5">
                <Text className="text-center font-serif-italic text-lg leading-7 text-ink">
                  “{item.entry.content}”
                </Text>
              </View>
            )}

            <Text className="mt-4 text-center font-body text-[15px] text-ink-soft">
              That happy you is still in there. Be gentle with yourself today.
            </Text>
          </>
        )}

        <SoftButton primary onPress={() => router.back()} className="mt-4 min-w-[160px]">
          Thank you
        </SoftButton>
      </View>
    </ModalCard>
  );
}
