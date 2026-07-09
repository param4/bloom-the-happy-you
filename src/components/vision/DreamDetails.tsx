import { Sparkles, Star } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';

import { GlowView } from '@/components/ui/GlowView';
import { GradientCard } from '@/components/ui/GradientCard';
import type { Manifestation } from '@/domain/manifestation';
import { useTheme } from '@/theme/ThemeProvider';

interface DreamDetailsProps {
  dream: Manifestation;
  /** Show the "Manifested ✨" badge when the dream is achieved. */
  showBadge?: boolean;
  /** Wrap the hero in a pulsing glow (used by the manifestation moment). */
  glow?: boolean;
}

/**
 * Read-only presentation of a dream — photo (or accent gradient) → title →
 * affirmation → why it matters. Shared by the vision-board detail modal and the
 * manifestation moment so the two stay visually identical. No action controls.
 */
export function DreamDetails({ dream, showBadge, glow }: DreamDetailsProps) {
  const { colors, gradients } = useTheme();

  const hero = dream.imageUri ? (
    <Image
      source={{ uri: dream.imageUri }}
      className="h-[180px] w-full rounded-2xl"
      resizeMode="cover"
    />
  ) : (
    <GradientCard colors={gradients.heroBadge} className="h-[180px] justify-end rounded-2xl p-4">
      <Sparkles size={28} color={colors.accentDeep} />
    </GradientCard>
  );

  return (
    <View className="w-full">
      {glow ? (
        <GlowView className="w-full" style={{ borderRadius: 16 }} durationMs={3500}>
          {hero}
        </GlowView>
      ) : (
        hero
      )}

      {showBadge && dream.achieved && (
        <View
          className="mt-4 flex-row items-center gap-2 self-start rounded-full px-3 py-1.5"
          style={{ backgroundColor: `${colors.sun}33` }}
        >
          <Star size={15} color={colors.accentDeep} fill={colors.sun} />
          <Text className="font-body-extrabold text-xs text-accent-deep">Manifested ✨</Text>
        </View>
      )}

      <Text className="mt-4 font-serif text-[22px] leading-[27px] text-ink">{dream.title}</Text>
      <Text className="mt-2 font-body-italic text-[15px] leading-[21px] text-ink-soft">
        “{dream.affirmation}”
      </Text>

      {dream.why.trim().length > 0 && (
        <View className="mt-5">
          <Text className="font-body-extrabold text-xs uppercase tracking-wide text-ink-soft">
            Why it matters
          </Text>
          <Text className="mt-1.5 font-serif text-[15px] leading-[21px] text-ink">{dream.why}</Text>
        </View>
      )}
    </View>
  );
}
