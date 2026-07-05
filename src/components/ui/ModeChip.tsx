import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

interface ModeChipProps {
  active: boolean;
  onPress: () => void;
  Icon: LucideIcon;
  label: string;
}

/** Write / Speak / Record selector chip in the pillar composer. */
export function ModeChip({ active, onPress, Icon, label }: ModeChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-[14px] py-2.5 ${
        active ? 'border-2 border-accent bg-card' : 'border border-line bg-transparent'
      }`}
    >
      <Icon size={16} color={active ? colors.accentDeep : colors.inkSoft} />
      <Text
        className={`font-body-extrabold text-[13px] ${
          active ? 'text-accent-deep' : 'text-ink-soft'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
