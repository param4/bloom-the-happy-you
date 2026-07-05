import { colors } from '@/theme/colors';

/** CBT-grounded affirmation library from the prototype. */
export const AFFIRMATIONS: Record<string, string[]> = {
  'Self-worth': [
    'I am enough exactly as I am today.',
    'My worth is not measured by what I produce.',
    'I belong here, and my presence matters.',
  ],
  Anxiety: [
    'This feeling is a wave. I can let it rise and pass.',
    'I am safe in this moment, breathing, right now.',
    'I don’t have to solve everything today.',
  ],
  'Self-forgiveness': [
    'I did the best I could with what I knew then.',
    'I release the weight I’ve been carrying for myself.',
    'Being human means being imperfect — and that’s okay.',
  ],
  Confidence: [
    'I trust myself to handle what comes.',
    'I have made it through hard days before.',
    'My voice deserves to be heard.',
  ],
  Calm: [
    'I let my shoulders soften and my jaw unclench.',
    'There is nowhere I need to rush to right now.',
    'I invite ease into this moment.',
  ],
};

export const AFFIRMATION_TINTS: Record<string, string> = {
  'Self-worth': colors.peach,
  Anxiety: colors.sage,
  'Self-forgiveness': colors.lav,
  Confidence: colors.sun,
  Calm: colors.sageDeep,
};
