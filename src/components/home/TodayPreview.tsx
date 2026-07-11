import { Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { TodoProgress } from '@/components/todo/TodoProgress';
import { TodoRow } from '@/components/todo/TodoRow';
import { BloomLogo } from '@/components/ui/BloomLogo';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { Todo } from '@/domain/todo';
import { useTheme } from '@/theme/ThemeProvider';

interface TodayPreviewProps {
  todos: Todo[];
  onToggle(id: string): void;
  onOpenList(): void;
}

/** Home-screen glimpse of today's list (first four items). */
export function TodayPreview({ todos, onToggle, onOpenList }: TodayPreviewProps) {
  const { colors } = useTheme();
  const doneCount = todos.filter((t) => t.done).length;

  return (
    <View className="mt-5">
      <SectionLabel
        right={
          <Pressable onPress={onOpenList} hitSlop={8}>
            <Text className="font-body-extrabold text-xs text-accent-deep">Open list</Text>
          </Pressable>
        }
      >
        Today’s list
      </SectionLabel>
      <Card className="rounded-[20px] p-4">
        {todos.length === 0 ? (
          <View className="items-center py-1">
            <Text className="mb-3 text-center font-body text-[13px] text-ink-soft">
              Nothing on today’s list yet.
            </Text>
            <Pressable
              onPress={onOpenList}
              className="flex-row items-center justify-center gap-2 rounded-2xl border border-accent bg-accent-soft px-4 py-2.5"
            >
              <Plus size={16} color={colors.accentDeep} />
              <Text className="font-body-extrabold text-[13px] text-accent-deep">
                Add something to do
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View className="mb-3">
              <TodoProgress done={doneCount} total={todos.length} compact />
            </View>
            <View className="gap-1">
              {todos.slice(0, 4).map((todo) => (
                <TodoRow key={todo.id} todo={todo} onToggle={() => onToggle(todo.id)} compact />
              ))}
            </View>
            {doneCount === todos.length && (
              <View className="mt-2.5 flex-row items-center gap-1.5">
                <BloomLogo size={16} color={colors.accentDeep} />
                <Text className="font-serif text-[13px] text-accent-deep">
                  All tended to — beautifully done.
                </Text>
              </View>
            )}
          </>
        )}
      </Card>
    </View>
  );
}
