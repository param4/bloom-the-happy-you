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
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ShareCardModal } from '@/components/share/ShareCardModal';
import { BloomBurst } from '@/components/ui/BloomBurst';
import { ToastHost } from '@/components/ui/Toast';
import { ClerkProfileSync } from '@/providers/ClerkProfileSync';
import { ServicesProvider } from '@/providers/ServicesProvider';
import { hydrateAll } from '@/state/hydration';
import { useThemeStore } from '@/state/themeStore';
import { colors } from '@/theme/colors';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { ThemeKey } from '@/domain/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
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

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <ServicesProvider>
            <ThemeProvider themeKey={themeKey} onChangeTheme={onChangeTheme}>
              <SplashGate fontsLoaded={fontsLoaded} hydrated={hydrated}>
                <StatusBar style="dark" backgroundColor={colors.cream} />
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
  const ready = fontsLoaded && hydrated && clerkLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return <>{children}</>;
}
