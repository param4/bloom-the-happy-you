import { Pressable, ScrollView, Text } from 'react-native';

import { shadows } from '@/theme/shadows';

interface CategoryChipsProps {
  categories: string[];
  selected: string;
  tints: Record<string, string>;
  onSelect(category: string): void;
}

/** Horizontal scrolling category picker. */
export function CategoryChips({ categories, selected, tints, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pb-1.5"
      className="mb-4"
    >
      {categories.map((category) => {
        const on = selected === category;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            className={`rounded-full px-3.5 py-2 ${on ? 'bg-white' : 'bg-card'}`}
            style={[
              shadows.softer,
              { borderWidth: 2, borderColor: on ? tints[category] : 'transparent' },
            ]}
          >
            <Text className="font-display text-[13px] text-ink">{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
