import { useRouter } from 'expo-router';
import { Video } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { GreetingHeader } from '@/components/home/GreetingHeader';
import { MomentCta } from '@/components/home/MomentCta';
import { MoodCheckIn } from '@/components/home/MoodCheckIn';
import { PillarCards } from '@/components/home/PillarCards';
import { StreakCard } from '@/components/home/StreakCard';
import { TodayPreview } from '@/components/home/TodayPreview';
import { Screen } from '@/components/ui/Screen';
import type { EntryKind } from '@/domain/entry';
import { LOW_MOODS, type MoodKey } from '@/domain/mood';
import { useGreeting } from '@/hooks/useGreeting';
import { haptics } from '@/lib/haptics';
import { resetContentData } from '@/state/hydration';
import { useMoodStore } from '@/state/moodStore';
import { useProfileStore } from '@/state/profileStore';
import { useStreakStore } from '@/state/streakStore';
import { useToastStore } from '@/state/toastStore';
import { useTodosStore } from '@/state/todosStore';
import { colors } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const greeting = useGreeting();

  const profile = useProfileStore((s) => s.profile);
  const flash = useToastStore((s) => s.flash);
  const streak = useStreakStore((s) => s.streak);
  const todos = useTodosStore((s) => s.todos);
  const toggleTodo = useTodosStore((s) => s.toggle);
  const moodToday = useMoodStore((s) => s.today);
  const pickMood = useMoodStore((s) => s.pickMood);

  const liftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (liftTimer.current) clearTimeout(liftTimer.current);
  }, []);

  if (!profile) return null; // the (app) gate redirects; avoids a flash

  const firstName = (profile.name || 'friend').split(' ')[0];

  const onPickMood = (mood: MoodKey) => {
    haptics.select();
    pickMood(mood);
    // Prototype flow: a low/okay mood gently opens a happier moment.
    if (LOW_MOODS.includes(mood)) {
      liftTimer.current = setTimeout(() => router.push('/(app)/lift-me-up'), 450);
    }
  };

  const openPillar = (kind: EntryKind) =>
    router.push({ pathname: '/(app)/pillar/[kind]', params: { kind } });

  const onClearData = async () => {
    await resetContentData();
    haptics.select();
    flash('Your space is clear — a fresh start.');
  };

  return (
    <Screen padBottom={48}>
      <View className="px-5 pt-3">
        <GreetingHeader profile={profile} onClearData={onClearData} />

        <Text className="mb-1 mt-5 font-display text-[27px] text-ink">
          {greeting}, {firstName}.
        </Text>
        <Text className="font-body text-[15px] text-ink-soft">
          Two quiet minutes for yourself. No pressure, ever.
        </Text>

        <StreakCard streak={streak} />

        <MoodCheckIn
          moodToday={moodToday}
          onPick={onPickMood}
          onLiftMeUp={() => router.push('/(app)/lift-me-up')}
        />

        <PillarCards
          onOpenPillar={openPillar}
          onOpenVision={() => router.push('/(app)/(tabs)/vision')}
        />

        <TodayPreview
          todos={todos}
          onToggle={toggleTodo}
          onOpenList={() => router.push('/(app)/(tabs)/today')}
        />

        <MomentCta onPress={() => router.push('/(app)/manifestation-moment')} />

        <Pressable
          onPress={() => router.push('/(app)/(tabs)/booth')}
          className="mt-4 flex-row items-center justify-center gap-1.5 py-1"
        >
          <Video size={18} color={colors.lavDeep} />
          <Text className="font-display text-sm text-lav-deep">
            Capture today in the Joy Booth
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
