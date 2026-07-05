/** Font family constants — RN needs one family name per weight (no synthesis). */
export const fonts = {
  // Fraunces (serif) — headings, greetings, entry & affirmation body.
  serif: 'Fraunces_600SemiBold',
  serifMedium: 'Fraunces_500Medium',
  serifRegular: 'Fraunces_400Regular',
  serifItalic: 'Fraunces_400Regular_Italic',
  // Nunito (ui) — labels, buttons, nav, meta.
  body: 'Nunito_400Regular',
  bodySemiBold: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyExtraBold: 'Nunito_800ExtraBold',
  bodyItalic: 'Nunito_400Regular_Italic',
} as const;
