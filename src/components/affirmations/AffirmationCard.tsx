import { Quote } from 'lucide-react-native';
import { Text } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { tintToWhite } from '@/theme/gradients';

interface AffirmationCardProps {
  text: string;
  tint: string;
}

/** One tinted affirmation quote card. */
export function AffirmationCard({ text, tint }: AffirmationCardProps) {
  return (
    <GradientCard
      colors={tintToWhite(tint)}
      className="flex-row items-start gap-3 rounded-[20px] p-5"
      style={{ borderWidth: 1, borderColor: `${tint}44` }}
    >
      <Quote size={22} color={tint} style={{ marginTop: 2 }} />
      <Text className="flex-1 font-display-semibold text-lg leading-7 text-ink">{text}</Text>
    </GradientCard>
  );
}
