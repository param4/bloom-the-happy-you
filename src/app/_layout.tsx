import '../global.css';
import '@/theme/interop';

import {
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ShareCardModal } from '@/components/share/ShareCardModal';
import { BloomBurst } from '@/components/ui/BloomBurst';
import { ToastHost } from '@/components/ui/Toast';
import { HIDE_LOGIN } from '@/constants/flags';
import { ClerkProfileSync } from '@/providers/ClerkProfileSync';
import { ServicesProvider } from '@/providers/ServicesProvider';
import { hydrateAll } from '@/state/hydration';
import { useThemeStore } from '@/state/themeStore';
import { colors } from '@/theme/colors';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { ThemeKey } from '@/domain/theme';

SplashScreen.preventAutoHideAsync();

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!__DEV__ && clerkKey?.startsWith('pk_test_')) {
  // A release build must use the pk_live_ key (set it in the EAS build env);
  // the test instance is rate-limited and not meant to hold real accounts.
  console.warn('Clerk is running on a TEST publishable key in a production build.');
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Nunito_400Regular,
    Nunito_400Regular_Italic,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const [hydrated, setHydrated] = useState(false);

  const themeKey = useThemeStore((s) => s.themeKey);
  const setTheme = useThemeStore((s) => s.setTheme);
  const onChangeTheme = useCallback((key: ThemeKey) => void setTheme(key), [setTheme]);

  useEffect(() => {
    hydrateAll().finally(() => setHydrated(true));
  }, []);

  // A failed font load must not strand the app on the splash screen —
  // continue with system fonts instead.
  useEffect(() => {
    if (fontError) console.warn('Font loading failed; using system fonts.', fontError);
  }, [fontError]);

  return (
    <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <ServicesProvider>
            <ThemeProvider themeKey={themeKey} onChangeTheme={onChangeTheme}>
              <SplashGate fontsLoaded={fontsLoaded || !!fontError} hydrated={hydrated}>
                {/* edge-to-edge Android ignores StatusBar backgroundColor */}
                <StatusBar style="dark" />
                <ClerkProfileSync />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.cream },
                  }}
                />
                <ShareCardModal />
                <ToastHost />
                <BloomBurst />
              </SplashGate>
            </ThemeProvider>
          </ServicesProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

/**
 * Holds the splash screen until fonts, local stores, AND Clerk's session have
 * all loaded, so no auth gate ever evaluates against half-restored state.
 * Lives inside ClerkProvider so it can read `useAuth().isLoaded`.
 */
function SplashGate({
  fontsLoaded,
  hydrated,
  children,
}: PropsWithChildren<{ fontsLoaded: boolean; hydrated: boolean }>) {
  const { isLoaded: clerkLoaded } = useAuth();
  // With login hidden no auth screen is reachable, so a slow or unreachable
  // Clerk instance must not hold every user at the splash screen.
  const ready = fontsLoaded && hydrated && (clerkLoaded || HIDE_LOGIN);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return <>{children}</>;
}

/**
 * Root error boundary (expo-router picks up this export). Without it a render
 * error in production unmounts the whole tree into a blank screen; this keeps
 * a gentle recovery path. Styled with static base tokens only — the themed
 * providers (and possibly the custom fonts) may be what just crashed.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    // The crash may happen before SplashGate hides the splash screen.
    SplashScreen.hideAsync();
    console.warn('Recovered from a render error:', error);
  }, [error]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cream,
        padding: 32,
      }}
    >
      <Text style={{ fontSize: 20, color: colors.ink, marginBottom: 8 }}>
        Something went wrong
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.inkSoft,
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        A quiet hiccup — your entries are safe. Let’s try that again.
      </Text>
      <Pressable
        onPress={retry}
        style={{
          backgroundColor: colors.ink,
          borderRadius: 14,
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Try again</Text>
      </Pressable>
    </View>
  );
}
