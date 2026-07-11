import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { KeyRound, Lock, Mail, User } from 'lucide-react-native';
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

import { BloomLogo } from '@/components/ui/BloomLogo';
import { GradientCard } from '@/components/ui/GradientCard';
import { SoftButton } from '@/components/ui/SoftButton';
import { useServices } from '@/providers/ServicesProvider';
import { useProfileStore } from '@/state/profileStore';
import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

type Mode = 'signup' | 'login';

export default function Welcome() {
  const router = useRouter();
  const { colors, gradients } = useTheme();
  const { profileService } = useServices();
  const setProfile = useProfileStore((s) => s.setProfile);
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();

  const [mode, setMode] = useState<Mode>('signup');
  const [pendingCode, setPendingCode] = useState(false); // sign-up email verification step
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const clerkReady = signUpLoaded && signInLoaded;

  const fail = (e: unknown) => {
    if (isClerkAPIResponseError(e)) {
      const first = e.errors[0];
      setError(first?.longMessage ?? first?.message ?? 'Something went wrong.');
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  // On success Clerk's session flips to signed-in; ClerkProfileSync populates the
  // store and the (auth) reverse gate forwards into the app (→ onboarding when new).
  const submit = async () => {
    if (!clerkReady || busy) return;
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') {
        await signUp.create({ emailAddress: email.trim(), password, unsafeMetadata: { name: name.trim() } });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingCode(true);
      } else {
        const res = await signIn.create({ identifier: email.trim(), password });
        if (res.status === 'complete') await setSignInActive({ session: res.createdSessionId });
        else setError('Additional steps are required to sign in.');
      }
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!signUpLoaded || busy) return;
    setError('');
    setBusy(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (res.status === 'complete') await setSignUpActive({ session: res.createdSessionId });
      else setError('That code did not work. Please try again.');
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const guest = async () => {
    const profile = await profileService.continueAsGuest();
    setProfile(profile);
    // The (app) gate forwards to onboarding when profile.onboarded is false.
    router.replace('/(app)/(tabs)');
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setPendingCode(false);
    setError('');
  };

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
              className="mb-4 h-[78px] w-[78px] items-center justify-center rounded-[26px]"
              style={shadows.soft}
            >
              <BloomLogo size={42} color={colors.accent} />
            </GradientCard>
            <Text className="font-serif text-4xl text-ink">Bloom</Text>
            <Text className="mt-1 font-serif-italic text-base text-ink-soft">
              The happy you
            </Text>
          </View>

          {/* card */}
          <View className="rounded-[26px] bg-card p-[22px]" style={shadows.soft}>
            {pendingCode ? (
              <VerifyStep
                code={code}
                setCode={setCode}
                email={email}
                error={error}
                busy={busy}
                onVerify={verify}
                onBack={() => switchMode('signup')}
              />
            ) : (
              <>
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
                      onPress={() => switchMode(key)}
                      className={`flex-1 items-center rounded-xl py-2.5 ${
                        mode === key ? 'bg-card' : ''
                      }`}
                      style={mode === key ? shadows.softer : undefined}
                    >
                      <Text
                        className={`font-body-extrabold text-sm ${
                          mode === key ? 'text-ink' : 'text-ink-soft'
                        }`}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {mode === 'signup' && (
                  <AuthField
                    Icon={User}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                  />
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
                  <Text className="mb-3 px-0.5 font-body-bold text-[13px] text-accent-deep">
                    {error}
                  </Text>
                ) : null}

                <SoftButton primary onPress={submit} disabled={busy} className="mt-1 w-full">
                  {busy ? 'One moment…' : mode === 'signup' ? 'Begin' : 'Welcome back'}
                </SoftButton>

                {/* divider */}
                <View className="my-4 flex-row items-center gap-2.5">
                  <View className="h-px flex-1 bg-line" />
                  <Text className="font-body-extrabold text-xs text-ink-soft">or</Text>
                  <View className="h-px flex-1 bg-line" />
                </View>

                <Pressable onPress={guest} className="mt-1.5 items-center py-1">
                  <Text className="font-body-extrabold text-sm text-accent-deep">
                    Explore as a guest
                  </Text>
                </Pressable>
              </>
            )}
          </View>

          <Text className="mt-4 px-2 text-center font-body text-[11.5px] leading-4 text-ink-soft">
            Your account and entries are kept private. Guest mode stays on this device only.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface VerifyStepProps {
  code: string;
  setCode: (t: string) => void;
  email: string;
  error: string;
  busy: boolean;
  onVerify: () => void;
  onBack: () => void;
}

function VerifyStep({ code, setCode, email, error, busy, onVerify, onBack }: VerifyStepProps) {
  return (
    <View>
      <Text className="font-serif text-lg text-ink">Check your email</Text>
      <Text className="mb-4 mt-1 font-body text-[13px] leading-5 text-ink-soft">
        We sent a verification code to {email || 'your inbox'}. Enter it to finish creating your
        account.
      </Text>
      <AuthField
        Icon={KeyRound}
        placeholder="Verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error ? (
        <Text className="mb-3 px-0.5 font-body-bold text-[13px] text-accent-deep">{error}</Text>
      ) : null}
      <SoftButton primary onPress={onVerify} disabled={busy} className="mt-1 w-full">
        {busy ? 'Verifying…' : 'Verify & continue'}
      </SoftButton>
      <Pressable onPress={onBack} className="mt-3 items-center py-1">
        <Text className="font-body-extrabold text-sm text-ink-soft">Back</Text>
      </Pressable>
    </View>
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
  const { colors } = useTheme();
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
