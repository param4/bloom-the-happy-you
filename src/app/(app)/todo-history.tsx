import { ChevronDown } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyNote } from '@/components/ui/EmptyNote';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/ui/TopBar';
import { TodoProgress } from '@/components/todo/TodoProgress';
import { TodoRow } from '@/components/todo/TodoRow';
import type { Todo } from '@/domain/todo';
import { useTodayKey } from '@/hooks/useTodayKey';
import { dayDiff, fmtDay, type DateKey } from '@/lib/dates';
import { useTodosStore } from '@/state/todosStore';
import { useTheme } from '@/theme/ThemeProvider';

/** A friendly heading for a past day: "Yesterday" or e.g. "Sat, Jul 4". */
function dayHeading(key: DateKey, today: DateKey): string {
  return dayDiff(key, today) === 1 ? 'Yesterday' : fmtDay(key);
}

interface DayListProps {
  dateKey: DateKey;
  today: DateKey;
  todos: Todo[];
  open: boolean;
  onToggleOpen(): void;
  onToggleTodo(id: string): void;
}

/** One past day's list — collapsible header + tickable rows. */
function DayList({ dateKey, today, todos, open, onToggleOpen, onToggleTodo }: DayListProps) {
  const { colors } = useTheme();
  const done = todos.filter((t) => t.done).length;

  return (
    <Card bordered className="mb-3 overflow-hidden rounded-2xl">
      <Pressable
        onPress={onToggleOpen}
        className="px-4 py-3.5"
        accessibilityLabel={`${dayHeading(dateKey, today)}, ${open ? 'collapse' : 'expand'}`}
      >
        <View className="flex-row items-center gap-3">
          <ChevronDown
            size={18}
            color={colors.inkSoft}
            style={{ transform: [{ rotate: open ? '0deg' : '-90deg' }] }}
          />
          <Text className="flex-1 font-serif text-[17px] text-ink">
            {dayHeading(dateKey, today)}
          </Text>
          <Text className="font-body-extrabold text-xs text-ink-soft">
            {done}/{todos.length} done
          </Text>
        </View>
        <View className="mt-2.5 pl-[30px]">
          <TodoProgress done={done} total={todos.length} compact />
        </View>
      </Pressable>

      {open && (
        <View className="border-t border-line px-4 pb-2 pt-1">
          {todos.map((t) => (
            <TodoRow key={t.id} todo={t} onToggle={() => onToggleTodo(t.id)} compact />
          ))}
        </View>
      )}
    </Card>
  );
}

export default function TodoHistoryScreen() {
  const today = useTodayKey();
  const all = useTodosStore((s) => s.all);
  const toggle = useTodosStore((s) => s.toggle);

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

  // Most recent past day starts expanded; the rest collapsed.
  const [openKeys, setOpenKeys] = useState<Set<DateKey>>(() =>
    new Set(days[0] ? [days[0][0]] : []),
  );

  const toggleOpen = (key: DateKey) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <Screen safeBottom>
      <TopBar title="Previous lists" />
      <View className="px-5">
        <Text className="mb-4 font-body text-sm text-ink-soft">
          Each day keeps its own list. Tap a day to open it — you can still tick things off, no
          matter when they were written.
        </Text>

        {days.length === 0 ? (
          <EmptyNote>No past lists yet. Your days will gather here as they pass.</EmptyNote>
        ) : (
          days.map(([dateKey, todos]) => (
            <DayList
              key={dateKey}
              dateKey={dateKey}
              today={today}
              todos={todos}
              open={openKeys.has(dateKey)}
              onToggleOpen={() => toggleOpen(dateKey)}
              onToggleTodo={toggle}
            />
          ))
        )}
      </View>
    </Screen>
  );
}
