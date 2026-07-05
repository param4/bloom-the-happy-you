const { palette } = require('./src/theme/palette.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        display: ['Quicksand_700Bold'],
        'display-semibold': ['Quicksand_600SemiBold'],
        'display-medium': ['Quicksand_500Medium'],
        body: ['Nunito_400Regular'],
        'body-semibold': ['Nunito_600SemiBold'],
        'body-bold': ['Nunito_700Bold'],
        'body-italic': ['Nunito_400Regular_Italic'],
      },
    },
  },
  plugins: [],
};
