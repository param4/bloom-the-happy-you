import { CloudRain, Meh, Smile, Sun, type LucideIcon } from 'lucide-react-native';

import type { MoodKey } from '@/domain/mood';
import { colors } from '@/theme/colors';

export interface MoodMeta {
  key: MoodKey;
  label: string;
  Icon: LucideIcon;
  tone: string;
}

export const MOODS: MoodMeta[] = [
  { key: 'joyful', label: 'Joyful', Icon: Sun, tone: colors.sun },
  { key: 'content', label: 'Content', Icon: Smile, tone: colors.sage },
  { key: 'okay', label: 'Okay', Icon: Meh, tone: colors.lav },
  { key: 'low', label: 'Low', Icon: CloudRain, tone: colors.lavDeep },
];
