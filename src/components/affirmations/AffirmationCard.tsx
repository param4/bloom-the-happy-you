import { Quote, Share2, Trash2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeProvider';

interface AffirmationCardProps {
  text: string;
  onShare?(): void;
  onRemove?(): void;
}

/** Mini pill button matching the web `miniBtn` style. */
function MiniButton({
  label,
  Icon,
  onPress,
}: {
  label: string;
  Icon: typeof Share2;
  onPress?(): void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1.5 rounded-[10px] border border-line bg-cream px-3 py-1.5"
    >
      <Icon size={14} color={colors.inkSoft} />
      <Text className="font-body-extrabold text-xs text-ink-soft">{label}</Text>
    </Pressable>
  );
}

/** One affirmation quote card with optional share/remove actions. */
export function AffirmationCard({ text, onShare, onRemove }: AffirmationCardProps) {
  const { colors } = useTheme();
  return (
    <Card bordered className="rounded-[20px] p-5">
      <View className="flex-row items-start gap-3">
        <Quote size={22} color={colors.accent} style={{ marginTop: 2 }} />
        <Text className="flex-1 font-serif text-lg leading-7 text-ink">{text}</Text>
      </View>
      {onShare || onRemove ? (
        <View className="mt-3 flex-row gap-2">
          {onShare ? <MiniButton label="Share as card" Icon={Share2} onPress={onShare} /> : null}
          {onRemove ? <MiniButton label="Remove" Icon={Trash2} onPress={onRemove} /> : null}
        </View>
      ) : null}
    </Card>
  );
}
