import { Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { LOW_MOODS, type MoodKey } from '@/domain/mood';
import { MOODS } from '@/constants/moods';
import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

interface MoodCheckInProps {
  moodToday: MoodKey | null;
  onPick(mood: MoodKey): void;
  onLiftMeUp(): void;
}

/** "How are you, honestly?" — low moods surface the lift-me-up button. */
export function MoodCheckIn({ moodToday, onPick, onLiftMeUp }: MoodCheckInProps) {
  const { colors } = useTheme();
  const showLift = moodToday !== null && LOW_MOODS.includes(moodToday);

  return (
    <View className="mt-5">
      <SectionLabel>How are you, honestly?</SectionLabel>
      <View className="flex-row gap-2.5">
        {MOODS.map(({ key, label, Icon }) => {
          const on = moodToday === key;
          return (
            <Pressable
              key={key}
              onPress={() => onPick(key)}
              className="flex-1 items-center gap-1.5 rounded-[18px] bg-card px-1.5 py-3.5"
              style={[
                shadows.softer,
                { borderWidth: 2, borderColor: on ? colors.accent : 'transparent' },
              ]}
            >
              <Icon size={24} color={on ? colors.accent : colors.inkSoft} />
              <Text className="font-body-extrabold text-xs text-ink">{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {showLift && (
        <Pressable
          onPress={onLiftMeUp}
          className="mt-3 flex-row items-center justify-center gap-2 rounded-2xl bg-accent-soft py-3.5"
        >
          <Sparkles size={18} color={colors.accentDeep} />
          <Text className="font-body-extrabold text-[15px] text-accent-deep">
            Show me a happier moment
          </Text>
        </Pressable>
      )}
    </View>
  );
}
