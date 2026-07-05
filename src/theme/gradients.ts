import { colors } from './colors';

type GradientStops = readonly [string, string, ...string[]];

/**
 * Named gradient tuples matching every gradient in Draft.jsx.
 * Tailwind gradient classes don't render in RN — use these with
 * <LinearGradient colors={gradients.x}> (via GradientCard).
 */
export const gradients = {
  /** auth hero badge — 140deg sageLight → lavLight */
  heroBadge: [colors.sageLight, colors.lavLight] as GradientStops,
  /** avatar + manifestation-moment CTA — 135deg peach → sun */
  peachSun: [colors.peach, colors.sun] as GradientStops,
  /** "show me a happier moment" button — 120deg lavLight → sageLight */
  lift: [colors.lavLight, colors.sageLight] as GradientStops,
  /** vision "take today's moment" button — 135deg lav → peach */
  visionMoment: [colors.lav, colors.peach] as GradientStops,
  /** todo progress bar — 90deg sage → sun */
  progress: [colors.sage, colors.sun] as GradientStops,
  /** all-done banner — 120deg sun(13%) → sageLight */
  allDone: [`${colors.sun}22`, colors.sageLight] as GradientStops,
  /** manifested row — 120deg sun(13%) → white */
  manifested: [`${colors.sun}22`, '#FFFFFF'] as GradientStops,
} as const;

/** dream-card / moment backdrop: hue → white (140–160deg) */
export const hueToWhite = (hue: string): GradientStops => [hue, '#FFFFFF'];

/** video placeholder: clip color → cream (135deg) */
export const colorToCream = (color: string): GradientStops => [color, colors.cream];

/** affirmation card: tint(13%) → white (135deg) */
export const tintToWhite = (tint: string): GradientStops => [`${tint}22`, '#FFFFFF'];

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
