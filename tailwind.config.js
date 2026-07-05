const { palette } = require('./src/theme/palette.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        // Fraunces serif — headings, greetings, entry/affirmation body.
        serif: ['Fraunces_600SemiBold'],
        'serif-medium': ['Fraunces_500Medium'],
        'serif-regular': ['Fraunces_400Regular'],
        'serif-italic': ['Fraunces_400Regular_Italic'],
        // Nunito — UI labels, buttons, nav, meta.
        body: ['Nunito_400Regular'],
        'body-semibold': ['Nunito_600SemiBold'],
        'body-bold': ['Nunito_700Bold'],
        'body-extrabold': ['Nunito_800ExtraBold'],
        'body-italic': ['Nunito_400Regular_Italic'],
      },
    },
  },
  plugins: [],
};
