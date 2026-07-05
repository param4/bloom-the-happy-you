import { useRouter } from 'expo-router';
import { Flower2, Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GradientCard } from '@/components/ui/GradientCard';
import { SoftButton } from '@/components/ui/SoftButton';
import { useServices } from '@/providers/ServicesProvider';
import type { SocialProvider } from '@/services/interfaces';
import { useProfileStore } from '@/state/profileStore';
import { colors } from '@/theme/colors';
import { gradients } from '@/theme/gradients';
import { shadows } from '@/theme/shadows';

type Mode = 'signup' | 'login';

export default function Welcome() {
  const router = useRouter();
  const { profileService } = useServices();
  const setProfile = useProfileStore((s) => s.setProfile);

  const [mode, setMode] = useState<Mode>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const enter = (profile: Parameters<typeof setProfile>[0]) => {
    setProfile(profile);
    router.replace('/(app)/(tabs)');
  };

  const submit = async () => {
    const result =
      mode === 'signup'
        ? await profileService.signUp(name, email, password)
        : await profileService.logIn(email, password);
    if (result.ok) enter(result.profile);
    else setError(result.error);
  };

  const social = async (provider: SocialProvider) =>
    enter(await profileService.socialSignIn(provider));

  const guest = async () => enter(await profileService.continueAsGuest());

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-cream"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-11"
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(500)}>
          {/* hero */}
          <View className="mb-7 items-center">
            <GradientCard
              colors={gradients.heroBadge}
              className="mb-4 h-[76px] w-[76px] items-center justify-center rounded-3xl"
              style={shadows.soft}
            >
              <Flower2 size={40} color={colors.peach} />
            </GradientCard>
            <Text className="font-display text-4xl text-ink">Bloom</Text>
            <Text className="mt-1 font-body-italic text-base text-ink-soft">
              Meet the happy you
            </Text>
          </View>

          {/* card */}
          <View className="rounded-[26px] bg-card p-[22px]" style={shadows.soft}>
            {/* mode toggle */}
            <View className="mb-4 flex-row rounded-2xl bg-cream p-1">
              {(
                [
                  ['signup', 'Create account'],
                  ['login', 'Log in'],
                ] as const
              ).map(([key, label]) => (
                <Pressable
                  key={key}
                  onPress={() => {
                    setMode(key);
                    setError('');
                  }}
                  className={`flex-1 items-center rounded-xl py-2.5 ${
                    mode === key ? 'bg-white' : ''
                  }`}
                  style={mode === key ? shadows.softer : undefined}
                >
                  <Text
                    className={`font-display text-sm ${
                      mode === key ? 'text-ink' : 'text-ink-soft'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {mode === 'signup' && (
              <AuthField Icon={User} placeholder="Your name" value={name} onChangeText={setName} />
            )}
            <AuthField
              Icon={Mail}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthField
              Icon={Lock}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? (
              <Text className="mb-3 px-0.5 font-body-semibold text-[13px] text-peach-deep">
                {error}
              </Text>
            ) : null}

            <SoftButton primary onPress={submit} className="mt-1 w-full">
              {mode === 'signup' ? 'Begin' : 'Welcome back'}
            </SoftButton>

            {/* divider */}
            <View className="my-4 flex-row items-center gap-2.5">
              <View className="h-px flex-1 bg-line" />
              <Text className="font-display text-xs text-ink-soft">or</Text>
              <View className="h-px flex-1 bg-line" />
            </View>

            {(['Google', 'Apple'] as const).map((provider) => (
              <Pressable
                key={provider}
                onPress={() => social(provider)}
                className="mb-2.5 flex-row items-center justify-center gap-2.5 rounded-2xl border border-line bg-card py-3"
              >
                <View
                  className={`h-5 w-5 items-center justify-center rounded-md ${
                    provider === 'Google' ? 'border border-line bg-white' : 'bg-ink'
                  }`}
                >
                  <Text
                    className="text-xs font-body-bold"
                    style={{ color: provider === 'Google' ? colors.peachDeep : '#fff' }}
                  >
                    {provider[0]}
                  </Text>
                </View>
                <Text className="font-display text-sm text-ink">Continue with {provider}</Text>
              </Pressable>
            ))}

            <Pressable onPress={guest} className="mt-1.5 items-center py-1">
              <Text className="font-display text-sm text-lav-deep">Explore as a guest</Text>
            </Pressable>
          </View>

          <Text className="mt-4 px-2 text-center font-body text-[11.5px] leading-4 text-ink-soft">
            Local sign-in for now. Your real, secure account and synced entries arrive with the
            full app.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface AuthFieldProps {
  Icon: typeof Mail;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
}

function AuthField({ Icon, ...input }: AuthFieldProps) {
  return (
    <View className="mb-3 flex-row items-center gap-2.5 rounded-2xl border border-line bg-cream px-3.5 py-3">
      <Icon size={18} color={colors.inkSoft} />
      <TextInput
        className="flex-1 p-0 font-body text-[15px] text-ink"
        placeholderTextColor={colors.inkSoft}
        {...input}
      />
    </View>
  );
}
