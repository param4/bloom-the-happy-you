/**
 * Single source of truth for the Bloom palette (from MeetTheHappyYou.jsx).
 * Direction: warm cream + paper grain, a clay/terracotta identity with sage &
 * blush alternates chosen during onboarding.
 *
 * BASE colors are fixed. The accent triplet (accent/accentDeep/accentSoft) is
 * THEME-dependent and switched at runtime, so in Tailwind those three resolve
 * to CSS variables that NativeWind `vars()` fills from the active theme.
 *
 * Plain CommonJS so both tailwind.config.js (Node) and TS code consume it.
 */
const BASE = {
  cream: '#F4ECDD',
  card: '#FCF7EC',
  ink: { DEFAULT: '#3B322A', soft: '#8C8070' },
  line: '#E7DAC6',
  sun: '#E7B25C',
  sage: '#8FA783',
  blush: '#CBA091',
};

/** The three selectable accent themes (accent / accentDeep / accentSoft). */
const THEMES = {
  terracotta: { accent: '#B26647', accentDeep: '#8F4E33', accentSoft: '#ECD8C9' },
  sage: { accent: '#7E9A6F', accentDeep: '#5E7A50', accentSoft: '#DDE7D2' },
  blush: { accent: '#C07D6E', accentDeep: '#A15B4C', accentSoft: '#F1DCD4' },
};

const DEFAULT_THEME = 'terracotta';

/** Tailwind palette — accents are CSS vars filled at runtime by ThemeProvider.
 *  Nested so className utilities read `bg-accent`, `bg-accent-deep`, `bg-accent-soft`. */
const palette = {
  ...BASE,
  accent: {
    DEFAULT: 'var(--accent)',
    deep: 'var(--accentDeep)',
    soft: 'var(--accentSoft)',
  },
};

module.exports = { BASE, THEMES, DEFAULT_THEME, palette };
