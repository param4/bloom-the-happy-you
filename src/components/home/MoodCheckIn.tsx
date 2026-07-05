import { Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LOW_MOODS, type MoodKey } from '@/domain/mood';
import { MOODS } from '@/constants/moods';
import { colors } from '@/theme/colors';
import { gradients } from '@/theme/gradients';
import { shadows } from '@/theme/shadows';

interface MoodCheckInProps {
  moodToday: MoodKey | null;
  onPick(mood: MoodKey): void;
  onLiftMeUp(): void;
}

/** "How are you, honestly?" — low moods surface the lift-me-up button. */
export function MoodCheckIn({ moodToday, onPick, onLiftMeUp }: MoodCheckInProps) {
  const showLift = moodToday !== null && LOW_MOODS.includes(moodToday);

  return (
    <View className="mt-4">
      <SectionLabel>How are you, honestly?</SectionLabel>
      <View className="flex-row gap-2.5">
        {MOODS.map(({ key, label, Icon, tone }) => {
          const on = moodToday === key;
          return (
            <Pressable
              key={key}
              onPress={() => onPick(key)}
              className={`flex-1 items-center gap-1.5 rounded-[18px] px-1.5 py-3.5 ${
                on ? 'bg-white' : 'bg-card'
              }`}
              style={[shadows.softer, { borderWidth: 2, borderColor: on ? tone : 'transparent' }]}
            >
              <Icon size={24} color={tone} />
              <Text className="font-display text-xs text-ink">{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {showLift && (
        <Pressable onPress={onLiftMeUp} className="mt-3">
          <GradientCard
            colors={gradients.lift}
            direction="wide"
            className="flex-row items-center justify-center gap-2 rounded-2xl py-3.5"
          >
            <Sparkles size={18} color={colors.lavDeep} />
            <Text className="font-display text-[15px] text-lav-deep">
              Show me a happier moment
            </Text>
          </GradientCard>
        </Pressable>
      )}
    </View>
  );
}
