/**
 * Single source of truth for the Bloom palette (from Draft.jsx, chosen with
 * color theory for mood upliftment: sage = calm/growth, cream = warmth,
 * lavender = soothing, peach/coral = delight).
 * Plain CommonJS so both tailwind.config.js (Node) and TS code consume it.
 */
const palette = {
  cream: { DEFAULT: '#FBF7F0', deep: '#F3ECDF' },
  card: '#FFFFFF',
  sage: { DEFAULT: '#9DBE93', light: '#DEE9D6', deep: '#6E8C63' },
  lav: { DEFAULT: '#C7BAE4', light: '#EBE5F7', deep: '#8E7DB6' },
  peach: { DEFAULT: '#F0A184', deep: '#E5875F' },
  sun: '#F4C978',
  ink: { DEFAULT: '#3E3A35', soft: '#7A736A' },
  line: '#EAE2D6',
};

module.exports = { palette };
