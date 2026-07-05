const { palette } = require('./palette.js') as {
  palette: {
    cream: { DEFAULT: string; deep: string };
    card: string;
    sage: { DEFAULT: string; light: string; deep: string };
    lav: { DEFAULT: string; light: string; deep: string };
    peach: { DEFAULT: string; deep: string };
    sun: string;
    ink: { DEFAULT: string; soft: string };
    line: string;
  };
};

/** Flat, typed color tokens for TS code (icons, gradients, shadows…). */
export const colors = {
  cream: palette.cream.DEFAULT,
  creamDeep: palette.cream.deep,
  card: palette.card,
  sage: palette.sage.DEFAULT,
  sageLight: palette.sage.light,
  sageDeep: palette.sage.deep,
  lav: palette.lav.DEFAULT,
  lavLight: palette.lav.light,
  lavDeep: palette.lav.deep,
  peach: palette.peach.DEFAULT,
  peachDeep: palette.peach.deep,
  sun: palette.sun,
  ink: palette.ink.DEFAULT,
  inkSoft: palette.ink.soft,
  line: palette.line,
} as const;

export type ColorToken = keyof typeof colors;
