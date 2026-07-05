import { useState } from 'react';
import { Text, View } from 'react-native';

import { AffirmationCard } from '@/components/affirmations/AffirmationCard';
import { CategoryChips } from '@/components/affirmations/CategoryChips';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/ui/TopBar';
import { AFFIRMATION_TINTS, AFFIRMATIONS } from '@/constants/affirmations';
import { colors } from '@/theme/colors';

const CATEGORIES = Object.keys(AFFIRMATIONS);

export default function AffirmationsScreen() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const tint = AFFIRMATION_TINTS[category];

  return (
    <Screen>
      <TopBar title="Affirmations" tint={colors.sageDeep} />
      <View className="px-5">
        <Text className="mb-4 font-body text-sm text-ink-soft">
          Grounded in CBT and self-compassion — not empty pep talk. Pick what you need today.
        </Text>

        <CategoryChips
          categories={CATEGORIES}
          selected={category}
          tints={AFFIRMATION_TINTS}
          onSelect={setCategory}
        />

        <View className="gap-3">
          {AFFIRMATIONS[category].map((text) => (
            <AffirmationCard key={text} text={text} tint={tint} />
          ))}
        </View>
      </View>
    </Screen>
  );
}
