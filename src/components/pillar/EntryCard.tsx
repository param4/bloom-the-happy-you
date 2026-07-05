import { useAudioPlayer } from 'expo-audio';
import { Pause, Play, Quote, Mic, Send, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import type { Entry } from '@/domain/entry';
import { fmtDay } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';

interface EntryCardProps {
  e: Entry;
  onShare?: () => void;
  onSend?: () => void;
}

/** One saved reflection — text, voice, or video — with gentle action buttons. */
export function EntryCard({ e, onShare, onSend }: EntryCardProps) {
  const { colors } = useTheme();
  const [playing, setPlaying] = useState(false);
  const player = useAudioPlayer(e.audioUri ?? undefined);

  const Icon = e.type === 'video' ? Play : e.type === 'voice' ? Mic : Quote;

  const body =
    e.type === 'video'
      ? 'A recorded reflection'
      : e.type === 'voice'
        ? playing
          ? 'Playing your voice note…'
          : 'A voice reflection'
        : e.content;

  const togglePlay = () => {
    if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      try {
        player.seekTo(0);
      } catch {
        // fresh player — nothing to rewind
      }
      player.play();
      setPlaying(true);
    }
  };

  return (
    <Card bordered className="rounded-[18px] p-4">
      <View className="flex-row gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
          <Icon size={18} color={colors.accentDeep} />
        </View>
        <View className="flex-1">
          <Text className="font-serif text-[17px] leading-[26px] text-ink">{body}</Text>
          <Text className="mt-1 font-body-extrabold text-xs text-ink-soft">
            {fmtDay(e.dateKey)}
          </Text>
        </View>
      </View>

      {(e.type === 'voice' && e.audioUri) || (e.type === 'text' && (onShare || onSend)) ? (
        <View className="mt-3 flex-row gap-2">
          {e.type === 'voice' && e.audioUri ? (
            <MiniButton
              onPress={togglePlay}
              Icon={playing ? Pause : Play}
              label={playing ? 'Pause' : 'Play'}
              color={colors.inkSoft}
            />
          ) : null}
          {e.type === 'text' && onShare ? (
            <MiniButton onPress={onShare} Icon={Share2} label="Share as card" color={colors.inkSoft} />
          ) : null}
          {e.type === 'text' && onSend ? (
            <MiniButton onPress={onSend} Icon={Send} label="Send it" color={colors.inkSoft} />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

function MiniButton({
  onPress,
  Icon,
  label,
  color,
}: {
  onPress: () => void;
  Icon: typeof Play;
  label: string;
  color: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1.5 rounded-[10px] border border-line bg-cream px-3 py-2"
    >
      <Icon size={14} color={color} />
      <Text className="font-body-extrabold text-xs text-ink-soft">{label}</Text>
    </Pressable>
  );
}
