import { CloudRain, Meh, Smile, Sun, type LucideIcon } from 'lucide-react-native';

import type { MoodKey } from '@/domain/mood';

export interface MoodMeta {
  key: MoodKey;
  label: string;
  Icon: LucideIcon;
}

/** The redesign colors moods by the active accent (selected) — no per-mood tone. */
export const MOODS: MoodMeta[] = [
  { key: 'joyful', label: 'Joyful', Icon: Sun },
  { key: 'content', label: 'Content', Icon: Smile },
  { key: 'okay', label: 'Okay', Icon: Meh },
  { key: 'low', label: 'Low', Icon: CloudRain },
];
