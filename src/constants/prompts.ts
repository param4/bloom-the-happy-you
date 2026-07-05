import type { EntryKind } from '@/domain/entry';

/** Rotating writing prompts so the composer is never a blank box. */
export const PROMPTS: Record<EntryKind, readonly string[]> = {
  gratitude: [
    'What are you looking forward to today?',
    'What small thing made you smile recently?',
    'Who or what supported you this week?',
    'What did your body do for you today?',
    'What comfort are you grateful for right now?',
    'What went better than you expected?',
    'What in this room are you glad to have?',
  ],
  appreciation: [
    'Who deserves your appreciation today?',
    'Whose small kindness stayed with you?',
    'What quality in yourself are you quietly proud of?',
    'Who made your week lighter?',
    "Who believed in you when you didn't?",
    'What part of you carried you through today?',
  ],
};

/** Day-of-year index used to pick a deterministic daily default prompt. */
export const dayIndex = (): number =>
  Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
