import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BloomLogo } from '@/components/ui/BloomLogo';
import { NotebookPad } from '@/components/ui/NotebookPad';
import { SoftButton } from '@/components/ui/SoftButton';
import { PROMPTS, dayIndex } from '@/constants/prompts';
import type { ThemeKey } from '@/domain/theme';
import { haptics } from '@/lib/haptics';
import { useBurstStore } from '@/state/burstStore';
import { useEntriesStore } from '@/state/entriesStore';
import { useProfileStore } from '@/state/profileStore';
import { useThemeStore } from '@/state/themeStore';
import { useTheme } from '@/theme/ThemeProvider';

const GOALS = [
  'Feel more grateful',
  'Manifest a dream',
  'Be kinder to myself',
  'Build a gentle daily habit',
];

const VIBES: { key: ThemeKey; label: string; color: string }[] = [
  { key: 'terracotta', label: 'Warm & earthy', color: '#B26647' },
  { key: 'sage', label: 'Calm & green', color: '#7E9A6F' },
  { key: 'blush', label: 'Soft & tender', color: '#C07D6E' },
];

/** The 60-second onboarding: goal → vibe/theme → first entry. */
export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const profile = useProfileStore((s) => s.profile);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const setTheme = useThemeStore((s) => s.setTheme);
  const themeKey = useThemeStore((s) => s.themeKey);
  const addEntry = useEntriesStore((s) => s.addEntry);
  const fireBurst = useBurstStore((s) => s.fire);

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [entry, setEntry] = useState('');

  const firstName = (profile?.name || 'friend').split(' ')[0];
  const prompt = PROMPTS.gratitude[dayIndex() % PROMPTS.gratitude.length];

  const finish = async () => {
    const text = entry.trim();
    if (text) {
      await addEntry('gratitude', { type: 'text', content: text });
      fireBurst();
    }
    await completeOnboarding();
    router.replace('/(app)/(tabs)');
  };

  return (
    <View className="flex-1 bg-cream" style={{ paddingTop: insets.top }}>
      <ScrollView
        contentContainerClassName="flex-grow px-6 pt-8"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* progress dots */}
        <View className="mb-7 flex-row gap-1.5">
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className={`h-[5px] flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`}
            />
          ))}
        </View>

        <Animated.View key={step} entering={FadeIn.duration(300)} className="flex-1">
          {step === 0 && (
            <View className="flex-1">
              <BloomLogo size={40} color={colors.accent} />
              <Text className="mb-2 mt-4 font-serif text-[30px] leading-9 text-ink">
                Welcome, {firstName}. Let’s set the mood — sixty seconds.
              </Text>
              <Text className="font-body text-base leading-6 text-ink-soft">
                What brings you here? Pick the one that feels closest.
              </Text>
              <View className="mt-4 gap-2.5">
                {GOALS.map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => setGoal(g)}
                    className={`rounded-2xl border-2 px-4 py-4 ${
                      goal === g ? 'border-accent bg-card' : 'border-line bg-transparent'
                    }`}
                  >
                    <Text className="font-serif text-[18px] text-ink">{g}</Text>
                  </Pressable>
                ))}
              </View>
              <View className="flex-1" />
              <SoftButton primary onPress={() => setStep(1)} className="mt-6 w-full">
                Continue
              </SoftButton>
            </View>
          )}

          {step === 1 && (
            <View className="flex-1">
              <Text className="mb-2 font-serif text-[30px] leading-9 text-ink">Pick your vibe.</Text>
              <Text className="font-body text-base leading-6 text-ink-soft">
                This sets the colour of your whole space. You can change it later.
              </Text>
              <View className="mt-4 gap-3">
                {VIBES.map((v) => {
                  const active = themeKey === v.key;
                  return (
                    <Pressable
                      key={v.key}
                      onPress={() => setTheme(v.key)}
                      className={`flex-row items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 ${
                        active ? 'border-accent bg-card' : 'border-line bg-transparent'
                      }`}
                    >
                      <View
                        className="h-[34px] w-[34px] rounded-full"
                        style={{ backgroundColor: v.color }}
                      />
                      <Text className="flex-1 font-serif text-[18px] text-ink">{v.label}</Text>
                      {active ? <Check size={20} color={colors.accent} /> : null}
                    </Pressable>
                  );
                })}
              </View>
              <View className="flex-1" />
              <SoftButton primary onPress={() => setStep(2)} className="mt-6 w-full">
                Continue
              </SoftButton>
            </View>
          )}

          {step === 2 && (
            <View className="flex-1">
              <Text className="mb-2 font-serif text-[30px] leading-9 text-ink">
                Now, your first bloom.
              </Text>
              <Text className="font-body text-base leading-6 text-ink-soft">
                Just one line — this is where it begins.
              </Text>
              <NotebookPad prompt={prompt} value={entry} onChangeText={setEntry} />
              <View className="flex-1" />
              <SoftButton
                primary
                onPress={() => {
                  haptics.success();
                  void finish();
                }}
                className="mt-6 w-full"
              >
                {entry.trim() ? 'Save my first entry' : 'Skip for now'}
              </SoftButton>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
