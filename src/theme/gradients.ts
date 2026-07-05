import type { ThemeColors } from './colors';

type GradientStops = readonly [string, string, ...string[]];

/**
 * Named gradient builders for the redesign. They take the active ThemeColors
 * (from useTheme) because every gradient is now accent-driven. Tailwind
 * gradients don't render in RN — use these with <LinearGradient> / GradientCard.
 */
export const makeGradients = (c: ThemeColors) =>
  ({
    /** auth hero badge / dream card — accentSoft → card (140deg) */
    heroBadge: [c.accentSoft, c.card] as GradientStops,
    /** avatar + manifestation-moment CTA — accent → sun (135deg) */
    accentSun: [c.accent, c.sun] as GradientStops,
    /** "show me a happier moment" / resurface — accentSoft → card */
    lift: [c.accentSoft, c.card] as GradientStops,
    /** todo progress bar — accent → sun (90deg) */
    progress: [c.accent, c.sun] as GradientStops,
    /** all-done banner — sun(13%) → accentSoft (120deg) */
    allDone: [`${c.sun}22`, c.accentSoft] as GradientStops,
    /** manifested row — sun(13%) → card (120deg) */
    manifested: [`${c.sun}22`, c.card] as GradientStops,
    /** branded frame backdrop — accentSoft → card (160deg) */
    frame: [c.accentSoft, c.card] as GradientStops,
  }) as const;

export type Gradients = ReturnType<typeof makeGradients>;

/** Direction presets approximating the web `deg` values. */
export const gradientDirections = {
  /** ~135deg — top-left → bottom-right */
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  /** ~120deg — flatter diagonal */
  wide: { start: { x: 0, y: 0 }, end: { x: 1, y: 0.6 } },
  /** ~160deg — steeper diagonal */
  steep: { start: { x: 0, y: 0 }, end: { x: 0.55, y: 1 } },
  /** 90deg — left → right */
  horizontal: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
} as const;
