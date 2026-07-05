import { Plus } from 'lucide-react-native';
import { Pressable, ScrollView, Text } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

interface CategoryChipsProps {
  categories: string[];
  selected: string;
  onSelect(category: string): void;
  /** Category that renders a leading Plus icon (e.g. "My own"). */
  plusFor?: string;
}

/** Horizontal scrolling category picker. */
export function CategoryChips({ categories, selected, onSelect, plusFor }: CategoryChipsProps) {
  const { colors } = useTheme();
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
            className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-2 ${
              on ? 'bg-card' : 'bg-transparent'
            }`}
            style={[
              on ? shadows.softer : undefined,
              { borderWidth: on ? 2 : 1, borderColor: on ? colors.accent : colors.line },
            ]}
          >
            {category === plusFor ? (
              <Plus size={14} color={on ? colors.accentDeep : colors.inkSoft} />
            ) : null}
            <Text className="font-body-extrabold text-[13px] text-ink">{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
