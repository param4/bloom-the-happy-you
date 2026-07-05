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
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ShareCardModal } from '@/components/share/ShareCardModal';
import { BloomBurst } from '@/components/ui/BloomBurst';
import { ToastHost } from '@/components/ui/Toast';
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

  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Hold the splash screen until fonts + stores are ready so the auth
  // gate never sees a half-hydrated state.
  if (!ready) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <ServicesProvider>
          <ThemeProvider themeKey={themeKey} onChangeTheme={onChangeTheme}>
            <StatusBar style="dark" backgroundColor={colors.cream} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.cream },
              }}
            />
            <ShareCardModal />
            <ToastHost />
            <BloomBurst />
          </ThemeProvider>
        </ServicesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
