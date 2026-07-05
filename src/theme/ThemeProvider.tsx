import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { View } from 'react-native';
import { vars } from 'nativewind';

import { makeGradients, type Gradients } from './gradients';
import {
  defaultThemeKey,
  resolveTheme,
  themeVars,
  type ThemeColors,
  type ThemeKey,
} from './colors';

interface ThemeContextValue {
  /** Active theme key ('terracotta' | 'sage' | 'blush'). */
  themeKey: ThemeKey;
  /** Fully-resolved colors (base + active accents) for icon/gradient props. */
  colors: ThemeColors;
  /** Accent-driven gradient tuples. */
  gradients: Gradients;
  /** Persist + apply a new theme. */
  setThemeKey(key: ThemeKey): void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  themeKey: ThemeKey;
  onChangeTheme(key: ThemeKey): void;
  children: ReactNode;
}

/**
 * Provides the active theme to the whole tree. The wrapping View carries
 * NativeWind `vars()` so className utilities like `bg-accent` recolor live;
 * `useTheme()` exposes resolved hex + gradients for props that can't use
 * className (lucide icon colors, LinearGradient tuples).
 */
export function ThemeProvider({
  themeKey,
  onChangeTheme,
  children,
}: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => {
    const colors = resolveTheme(themeKey);
    return {
      themeKey,
      colors,
      gradients: makeGradients(colors),
      setThemeKey: onChangeTheme,
    };
  }, [themeKey, onChangeTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={vars(themeVars(themeKey))} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export { defaultThemeKey };
export type { ThemeKey };
