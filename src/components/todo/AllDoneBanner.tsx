import { Flower2 } from 'lucide-react-native';
import { Text } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { colors } from '@/theme/colors';
import { gradients } from '@/theme/gradients';

/** Celebration banner when everything is tended to. */
export function AllDoneBanner() {
  return (
    <GradientCard
      colors={gradients.allDone}
      direction="wide"
      className="mb-4 flex-row items-center gap-2.5 rounded-[18px] p-4"
    >
      <Flower2 size={22} color={colors.peach} />
      <Text className="flex-1 font-display text-[15px] text-sage-deep">
        Everything tended to. Rest easy — you showed up today.
      </Text>
    </GradientCard>
  );
}
