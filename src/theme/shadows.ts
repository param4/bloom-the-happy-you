import type { ViewStyle } from 'react-native';

/** RN translations of the redesign's box-shadows (iOS shadow* + Android elevation). */
export const shadows = {
  /** web: 0 10px 30px rgba(90,70,45,0.12) */
  soft: {
    shadowColor: '#5A462D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 7,
  } satisfies ViewStyle,
  /** web: 0 4px 16px rgba(90,70,45,0.08) */
  softer: {
    shadowColor: '#5A462D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  } satisfies ViewStyle,
  /** web: 0 8px 18px rgba(120,70,40,0.28) — primary button */
  accentGlow: {
    shadowColor: '#784628',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 9,
    elevation: 5,
  } satisfies ViewStyle,
} as const;
