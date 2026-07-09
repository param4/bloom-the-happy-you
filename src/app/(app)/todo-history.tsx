import { CheckCircle2, Circle } from 'lucide-react-native';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TopBar } from '@/components/ui/TopBar';
import { TodoProgress } from '@/components/todo/TodoProgress';
import type { Todo } from '@/domain/todo';
import { useTodayKey } from '@/hooks/useTodayKey';
import { dayDiff, fmtDay, type DateKey } from '@/lib/dates';
import { useTodosStore } from '@/state/todosStore';
import { useTheme } from '@/theme/ThemeProvider';

/** A friendly heading for a past day: "Yesterday" or e.g. "Sat, Jul 4". */
function dayHeading(key: DateKey, today: DateKey): string {
  return dayDiff(key, today) === 1 ? 'Yesterday' : fmtDay(key);
}

/** A single past day's list — read-only. */
function DayList({ dateKey, today, todos }: { dateKey: DateKey; today: DateKey; todos: Todo[] }) {
  const { colors } = useTheme();
  const done = todos.filter((t) => t.done).length;

  return (
    <View className="mb-5">
      <SectionLabel
        right={
          <Text className="font-body-extrabold text-xs text-ink-soft">
            {done}/{todos.length} done
          </Text>
        }
      >
        {dayHeading(dateKey, today)}
      </SectionLabel>
      <View className="mb-2.5">
        <TodoProgress done={done} total={todos.length} compact />
      </View>
      <Card bordered className="gap-2.5 rounded-2xl px-4 py-3.5">
        {todos.map((t) => (
          <View key={t.id} className="flex-row items-center gap-2.5">
            {t.done ? (
              <CheckCircle2 size={20} color={colors.accent} />
            ) : (
              <Circle size={20} color={colors.line} />
            )}
            <Text
              className={`flex-1 font-body text-[15px] ${
                t.done ? 'text-ink-soft line-through opacity-60' : 'text-ink'
              }`}
            >
              {t.text}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

export default function TodoHistoryScreen() {
  const today = useTodayKey();
  const all = useTodosStore((s) => s.all);

  // Group every past day's todos by date key, newest first.
  const days = useMemo(() => {
    const byDay = new Map<DateKey, Todo[]>();
    for (const t of all) {
      if (t.dateKey >= today) continue;
      const list = byDay.get(t.dateKey) ?? [];
      list.push(t);
      byDay.set(t.dateKey, list);
    }
    return [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [all, today]);

  return (
    <Screen safeBottom>
      <TopBar title="Previous lists" />
      <View className="px-5">
        <Text className="mb-4 font-body text-sm text-ink-soft">
          Each day keeps its own list. Here’s where your past days rest — nothing to finish, just a
          gentle record of what you tended to.
        </Text>

        {days.length === 0 ? (
          <EmptyNote>No past lists yet. Your days will gather here as they pass.</EmptyNote>
        ) : (
          days.map(([dateKey, todos]) => (
            <DayList key={dateKey} dateKey={dateKey} today={today} todos={todos} />
          ))
        )}
      </View>
    </Screen>
  );
}
