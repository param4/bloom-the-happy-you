import type { ViewStyle } from 'react-native';

/** RN translations of the prototype's box-shadows (iOS shadow* + Android elevation). */
export const shadows = {
  /** web: 0 8px 24px rgba(120,110,95,0.10) */
  soft: {
    shadowColor: '#786E5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  } satisfies ViewStyle,
  /** web: 0 4px 14px rgba(120,110,95,0.08) */
  softer: {
    shadowColor: '#786E5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  } satisfies ViewStyle,
  /** web: 0 6px 16px rgba(229,135,95,0.35) — primary button */
  peachGlow: {
    shadowColor: '#E5875F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  } satisfies ViewStyle,
  /** web: 0 6px 16px rgba(142,125,182,0.4) — stop-recording button */
  lavGlow: {
    shadowColor: '#8E7DB6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  } satisfies ViewStyle,
  /** web: 0 8px 20px rgba(229,135,95,0.3) — manifestation CTA */
  peachGlowWide: {
    shadowColor: '#E5875F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  } satisfies ViewStyle,
} as const;
