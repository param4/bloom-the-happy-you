import { useRouter } from 'expo-router';
import { CalendarClock, CornerDownLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { AllDoneBanner } from '@/components/todo/AllDoneBanner';
import { TodoInput } from '@/components/todo/TodoInput';
import { TodoProgress } from '@/components/todo/TodoProgress';
import { TodoRow } from '@/components/todo/TodoRow';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/ui/TopBar';
import { useTodayKey } from '@/hooks/useTodayKey';
import { haptics } from '@/lib/haptics';
import { pendingFromLastDay, useTodosStore } from '@/state/todosStore';
import { useToastStore } from '@/state/toastStore';
import { useTheme } from '@/theme/ThemeProvider';

export default function TodayScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const day = useTodayKey();
  const all = useTodosStore((s) => s.all);
  const add = useTodosStore((s) => s.add);
  const toggle = useTodosStore((s) => s.toggle);
  const remove = useTodosStore((s) => s.remove);
  const inheritPending = useTodosStore((s) => s.inheritPending);
  const flash = useToastStore((s) => s.flash);

  const todos = all.filter((t) => t.dateKey === day);
  const doneCount = todos.filter((t) => t.done).length;
  const allDone = todos.length > 0 && doneCount === todos.length;

  // What could still be carried forward (not already on today's list).
  const todayTexts = new Set(todos.map((t) => t.text));
  const carryable = pendingFromLastDay(all, day).filter((t) => !todayTexts.has(t.text));
  const hasHistory = all.some((t) => t.dateKey < day);

  const onInherit = async () => {
    const count = await inheritPending();
    if (count > 0) {
      haptics.success();
      flash(count === 1 ? 'Brought forward 1 task' : `Brought forward ${count} tasks`);
    } else {
      flash('Nothing left to carry over');
    }
  };

  return (
    <Screen>
      <TopBar title="Today's list" />
      <View className="px-5">
        <Text className="mb-4 font-body text-sm text-ink-soft">
          A few things to tend to today. Check them off as you go — leaving some unfinished is
          completely okay.
        </Text>

        <TodoInput onAdd={add} />

        {(carryable.length > 0 || hasHistory) && (
          <View className="mb-4 flex-row gap-2.5">
            {carryable.length > 0 && (
              <Pressable
                onPress={onInherit}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-accent bg-accent-soft px-3 py-3"
              >
                <CornerDownLeft size={17} color={colors.accentDeep} />
                <Text className="font-body-extrabold text-[13px] text-accent-deep">
                  Bring forward {carryable.length} unfinished
                </Text>
              </Pressable>
            )}
            {hasHistory && (
              <Pressable
                onPress={() => router.push('/(app)/todo-history')}
                className="flex-row items-center justify-center gap-2 rounded-2xl border border-line bg-card px-3.5 py-3"
              >
                <CalendarClock size={17} color={colors.inkSoft} />
                <Text className="font-body-extrabold text-[13px] text-ink-soft">
                  Previous lists
                </Text>
              </Pressable>
            )}
          </View>
        )}

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
          Unfinished tasks aren’t failures — they’re just tomorrow’s gentle starting point.
        </Text>
      </View>
    </Screen>
  );
}
