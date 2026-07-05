const {
  BASE,
  THEMES,
  DEFAULT_THEME,
} = require('./palette.js') as {
  BASE: {
    cream: string;
    card: string;
    ink: { DEFAULT: string; soft: string };
    line: string;
    sun: string;
    sage: string;
    blush: string;
  };
  THEMES: Record<
    ThemeKey,
    { accent: string; accentDeep: string; accentSoft: string }
  >;
  DEFAULT_THEME: ThemeKey;
};

export type ThemeKey = 'terracotta' | 'sage' | 'blush';

export const THEME_KEYS: readonly ThemeKey[] = ['terracotta', 'sage', 'blush'];

export const themes = THEMES;
export const defaultThemeKey: ThemeKey = DEFAULT_THEME;

/** Fixed (theme-independent) tokens for TS code (icon colors, gradients…). */
export const base = {
  cream: BASE.cream,
  card: BASE.card,
  ink: BASE.ink.DEFAULT,
  inkSoft: BASE.ink.soft,
  line: BASE.line,
  sun: BASE.sun,
  sage: BASE.sage,
  blush: BASE.blush,
} as const;

/** A fully-resolved color set for a given theme (base + that theme's accents). */
export type ThemeColors = typeof base & {
  accent: string;
  accentDeep: string;
  accentSoft: string;
};

export const resolveTheme = (key: ThemeKey): ThemeColors => ({
  ...base,
  ...THEMES[key],
});

/**
 * CSS-variable values for a theme, consumed by NativeWind `vars()` so that
 * className utilities like `bg-accent` recolor live when the theme changes.
 */
export const themeVars = (key: ThemeKey): Record<string, string> => ({
  '--accent': THEMES[key].accent,
  '--accentDeep': THEMES[key].accentDeep,
  '--accentSoft': THEMES[key].accentSoft,
});

/**
 * Back-compat default export used by non-themed chrome (StatusBar, splash).
 * Only the fixed base tokens live here; accent colors must come from useTheme().
 */
export const colors = base;
