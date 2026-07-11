import { useRouter } from 'expo-router';
import { BookHeart, ChevronRight, Video } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { GreetingHeader } from '@/components/home/GreetingHeader';
import { MomentCta } from '@/components/home/MomentCta';
import { MoodCheckIn } from '@/components/home/MoodCheckIn';
import { PillarCards } from '@/components/home/PillarCards';
import { StreakCard } from '@/components/home/StreakCard';
import { TodayPreview } from '@/components/home/TodayPreview';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import type { EntryKind } from '@/domain/entry';
import { LOW_MOODS, type MoodKey } from '@/domain/mood';
import { useGreeting } from '@/hooks/useGreeting';
import { MONTHS } from '@/lib/dates';
import { haptics } from '@/lib/haptics';
import { resetContentData } from '@/state/hydration';
import { useMoodStore } from '@/state/moodStore';
import { useProfileStore } from '@/state/profileStore';
import { useStreakStore } from '@/state/streakStore';
import { useToastStore } from '@/state/toastStore';
import { useTodosStore } from '@/state/todosStore';
import { useTodayKey } from '@/hooks/useTodayKey';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeScreen() {
  const router = useRouter();
  const greeting = useGreeting();
  const { colors } = useTheme();

  const profile = useProfileStore((s) => s.profile);
  const flash = useToastStore((s) => s.flash);
  const streak = useStreakStore((s) => s.streak);
  const day = useTodayKey();
  const todos = useTodosStore((s) => s.all).filter((t) => t.dateKey === day);
  const toggleTodo = useTodosStore((s) => s.toggle);
  const moodToday = useMoodStore((s) => s.today);
  const pickMood = useMoodStore((s) => s.pickMood);

  const monthName = MONTHS[new Date().getMonth()];

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

        <Text className="mb-1 mt-5 font-serif text-[30px] text-ink">
          {greeting}, {firstName}.
        </Text>
        <Text className="font-body text-[15px] text-ink-soft">
          It's good to see you back. No pressure today — just two quiet minutes.
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

        {/* monthly recap */}
        <Pressable onPress={() => router.push('/(app)/recap')} className="mt-4">
          <Card bordered className="flex-row items-center gap-3 rounded-[20px] p-4">
            <View className="h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-accent-soft">
              <BookHeart size={22} color={colors.accentDeep} />
            </View>
            <View className="flex-1">
              <Text className="font-serif text-[17px] text-ink">Your {monthName}, gathered</Text>
              <Text className="font-body text-[13px] text-ink-soft">
                Everything you were grateful for this month.
              </Text>
            </View>
            <ChevronRight size={20} color={colors.inkSoft} />
          </Card>
        </Pressable>

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
          <Video size={18} color={colors.accentDeep} />
          <Text className="font-body-extrabold text-sm text-accent-deep">
            Capture today in the Joy Booth
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
