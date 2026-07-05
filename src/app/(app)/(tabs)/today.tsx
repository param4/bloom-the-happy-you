import { Text, View } from 'react-native';

import { AllDoneBanner } from '@/components/todo/AllDoneBanner';
import { TodoInput } from '@/components/todo/TodoInput';
import { TodoProgress } from '@/components/todo/TodoProgress';
import { TodoRow } from '@/components/todo/TodoRow';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/ui/TopBar';
import { useTodosStore } from '@/state/todosStore';
import { colors } from '@/theme/colors';

export default function TodayScreen() {
  const todos = useTodosStore((s) => s.todos);
  const add = useTodosStore((s) => s.add);
  const toggle = useTodosStore((s) => s.toggle);
  const remove = useTodosStore((s) => s.remove);

  const doneCount = todos.filter((t) => t.done).length;
  const allDone = todos.length > 0 && doneCount === todos.length;

  return (
    <Screen>
      <TopBar title="Today's list" tint={colors.sageDeep} />
      <View className="px-5">
        <Text className="mb-4 font-body text-sm text-ink-soft">
          A few things to tend to today. Check them off as you go — leaving some unfinished is
          completely okay.
        </Text>

        <TodoInput onAdd={add} />

        <View className="mb-4">
          <TodoProgress done={doneCount} total={todos.length} />
        </View>

        {allDone && <AllDoneBanner />}

        {todos.length === 0 ? (
          <EmptyNote>
            Your list is clear. Add a task above, or simply enjoy the open space.
          </EmptyNote>
        ) : (
          <View className="gap-2.5">
            {todos.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onToggle={() => toggle(todo.id)}
                onDelete={() => remove(todo.id)}
              />
            ))}
          </View>
        )}

        <Text className="mt-4 text-center font-body text-xs text-ink-soft">
          Unfinished tasks aren't failures — they're just tomorrow's gentle starting point.
        </Text>
      </View>
    </Screen>
  );
}
