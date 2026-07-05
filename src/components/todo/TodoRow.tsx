import { CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import type { Todo } from '@/domain/todo';
import { colors } from '@/theme/colors';

interface TodoRowProps {
  todo: Todo;
  onToggle(): void;
  onDelete?(): void;
  compact?: boolean;
}

/** One list item — checkable, optionally deletable. */
export function TodoRow({ todo, onToggle, onDelete, compact }: TodoRowProps) {
  const inner = (
    <>
      <Pressable onPress={onToggle} hitSlop={8} accessibilityLabel={todo.done ? 'Mark not done' : 'Mark done'}>
        {todo.done ? (
          <CheckCircle2 size={compact ? 22 : 26} color={colors.sage} />
        ) : (
          <Circle size={compact ? 22 : 26} color={colors.line} />
        )}
      </Pressable>
      <Text
        className={`flex-1 font-body ${compact ? 'text-[15px]' : 'text-base'} ${
          todo.done ? 'text-ink-soft line-through opacity-60' : 'text-ink'
        }`}
      >
        {todo.text}
      </Text>
      {onDelete ? (
        <Pressable onPress={onDelete} hitSlop={8} className="p-1" accessibilityLabel="Delete task">
          <Trash2 size={18} color={colors.line} />
        </Pressable>
      ) : null}
    </>
  );

  if (compact) {
    return (
      <Pressable onPress={onToggle} className="flex-row items-center gap-2.5 py-1.5">
        {inner}
      </Pressable>
    );
  }
  return (
    <Card className="flex-row items-center gap-3 rounded-2xl px-4 py-3.5">{inner}</Card>
  );
}
