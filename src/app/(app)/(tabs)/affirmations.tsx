import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { AffirmationCard } from '@/components/affirmations/AffirmationCard';
import { CategoryChips } from '@/components/affirmations/CategoryChips';
import { Card } from '@/components/ui/Card';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { Screen } from '@/components/ui/Screen';
import { SoftButton } from '@/components/ui/SoftButton';
import { TopBar } from '@/components/ui/TopBar';
import { AFFIRMATIONS } from '@/constants/affirmations';
import { useAffirmationsStore } from '@/state/affirmationsStore';
import { useShareCardStore } from '@/state/shareCardStore';
import { useTheme } from '@/theme/ThemeProvider';

const MY_OWN = 'My own';
const CATEGORIES = [...Object.keys(AFFIRMATIONS), MY_OWN];

export default function AffirmationsScreen() {
  const { colors } = useTheme();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [draft, setDraft] = useState('');
  const mine = useAffirmationsStore((s) => s.affirmations);

  const isMine = category === MY_OWN;

  const submit = () => {
    if (!draft.trim()) return;
    useAffirmationsStore.getState().add(draft.trim());
    setDraft('');
  };

  return (
    <Screen>
      <TopBar title="Affirmations" />
      <View className="px-5">
        <Text className="mb-4 font-body text-sm text-ink-soft">
          Grounded in CBT and self-compassion — not empty pep talk. Pick what you need, or write your
          own.
        </Text>

        <CategoryChips
          categories={CATEGORIES}
          selected={category}
          onSelect={setCategory}
          plusFor={MY_OWN}
        />

        {isMine ? (
          <>
            <Card bordered className="mb-4 rounded-[18px] p-4">
              <Text className="mb-1 font-serif text-[17px] text-ink">Write your own</Text>
              <Text className="mb-3 font-body text-[13px] text-ink-soft">
                The words that speak to you. Present tense works best.
              </Text>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                multiline
                placeholder="I am…"
                placeholderTextColor={colors.inkSoft}
                className="min-h-[64px] rounded-xl border border-line bg-cream p-3 font-serif text-lg text-ink"
                textAlignVertical="top"
              />
              <SoftButton primary onPress={submit} className="mt-2.5 w-full">
                Add my affirmation
              </SoftButton>
            </Card>

            {mine.length === 0 ? (
              <EmptyNote>Your own affirmations will live here. Add the first one above.</EmptyNote>
            ) : (
              <View className="gap-3">
                {mine.map((a) => (
                  <AffirmationCard
                    key={a.id}
                    text={a.text}
                    onShare={() =>
                      useShareCardStore
                        .getState()
                        .open({ kind: 'affirmation', label: 'my affirmation', text: a.text })
                    }
                    onRemove={() => useAffirmationsStore.getState().remove(a.id)}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View className="gap-3">
            {AFFIRMATIONS[category].map((text) => (
              <AffirmationCard
                key={text}
                text={text}
                onShare={() =>
                  useShareCardStore
                    .getState()
                    .open({ kind: 'affirmation', label: "today's affirmation", text })
                }
              />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
