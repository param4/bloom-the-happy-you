import { Flower2 } from 'lucide-react-native';
import { Text } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { useTheme } from '@/theme/ThemeProvider';

/** Celebration banner when everything is tended to. */
export function AllDoneBanner() {
  const { colors, gradients } = useTheme();
  return (
    <GradientCard
      colors={gradients.allDone}
      direction="wide"
      className="mb-4 flex-row items-center gap-2.5 rounded-[18px] p-4"
    >
      <Flower2 size={22} color={colors.accent} />
      <Text className="flex-1 font-serif text-[15px] text-accent-deep">
        Everything tended to. Rest easy — you showed up today.
      </Text>
    </GradientCard>
  );
}
