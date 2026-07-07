import { useEvent } from 'expo';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Check, Pause, Pencil, Play, Quote, Mic, Send, Share2, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import type { Entry } from '@/domain/entry';
import { fmtDay } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';

interface EntryCardProps {
  e: Entry;
  onShare?: () => void;
  onSend?: () => void;
  /** Save edited text content (text entries only). */
  onEdit?: (content: string) => void;
  /** Delete this entry (parent confirms). */
  onDelete?: () => void;
}

/** mm:ss for the video scrubber's elapsed/duration labels. */
function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** One saved reflection — text, voice, or video — with gentle action buttons. */
export function EntryCard({ e, onShare, onSend, onEdit, onDelete }: EntryCardProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [playing, setPlaying] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(e.content);

  const canEdit = e.type === 'text' && !!onEdit;

  const startEdit = () => {
    setDraft(e.content);
    setEditing(true);
  };

  const saveEdit = () => {
    const next = draft.trim();
    if (next && next !== e.content) onEdit?.(next);
    setEditing(false);
  };
  const player = useAudioPlayer(e.audioUri ?? undefined);
  const videoPlayer = useVideoPlayer(e.videoUri ?? null, (p) => {
    p.timeUpdateEventInterval = 0.25;
  });

  const { isPlaying: videoPlaying } = useEvent(videoPlayer, 'playingChange', {
    isPlaying: videoPlayer.playing,
  });
  const { currentTime } = useEvent(videoPlayer, 'timeUpdate', {
    currentTime: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });
  const { duration } = useEvent(videoPlayer, 'sourceLoad', {
    videoSource: null,
    duration: videoPlayer.duration,
    availableVideoTracks: [],
    availableSubtitleTracks: [],
    availableAudioTracks: [],
  });
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) * 100 : 0;

  const Icon = e.type === 'video' ? Play : e.type === 'voice' ? Mic : Quote;

  const body =
    e.type === 'video'
      ? e.content || 'A recorded reflection'
      : e.type === 'voice'
        ? playing
          ? 'Playing your voice note…'
          : 'A voice reflection'
        : e.content;

  const togglePlay = async () => {
    if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      // Ensure loud playback route (iOS may still be in the quiet record mode).
      try {
        await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
      } catch {
        // best-effort — play anyway
      }
      try {
        player.seekTo(0);
      } catch {
        // fresh player — nothing to rewind
      }
      player.play();
      setPlaying(true);
    }
  };

  const openVideo = () => {
    setVideoOpen(true);
    try {
      videoPlayer.currentTime = 0;
    } catch {
      // fresh player — nothing to rewind
    }
    videoPlayer.play();
  };

  const closeVideo = () => {
    videoPlayer.pause();
    try {
      videoPlayer.currentTime = 0;
    } catch {
      // fresh player — nothing to rewind
    }
    setVideoOpen(false);
  };

  const toggleVideoPlaying = () => {
    if (videoPlayer.playing) videoPlayer.pause();
    else videoPlayer.play();
  };

  const onScrub = (evt: { nativeEvent: { locationX: number } }) => {
    if (!trackWidth || !duration) return;
    const ratio = Math.min(Math.max(evt.nativeEvent.locationX / trackWidth, 0), 1);
    videoPlayer.currentTime = ratio * duration;
  };

  return (
    <Card bordered className="rounded-[18px] p-4">
      <View className="flex-row gap-3">
        {e.type === 'video' && e.videoUri ? (
          <Pressable
            onPress={openVideo}
            accessibilityLabel="Play video"
            className="h-[68px] w-[52px] overflow-hidden rounded-xl"
            style={{ backgroundColor: '#2b2620' }}
          >
            <VideoView
              player={videoPlayer}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              nativeControls={false}
            />
            <View className="absolute inset-0 items-center justify-center">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-black/40">
                <Play size={12} color="#fff" style={{ marginLeft: 1 }} />
              </View>
            </View>
            {duration > 0 ? (
              <View className="absolute bottom-1 right-1 rounded bg-black/55 px-1 py-px">
                <Text className="font-body-extrabold text-[9px] text-white">
                  {formatDuration(duration)}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ) : (
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
            <Icon size={18} color={colors.accentDeep} />
          </View>
        )}
        <View className="flex-1">
          {editing ? (
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              autoFocus
              textAlignVertical="top"
              placeholderTextColor={colors.inkSoft}
              className="rounded-xl border border-line bg-cream px-3 py-2 font-serif text-[17px] leading-[26px] text-ink"
            />
          ) : (
            <Text className="font-serif text-[17px] leading-[26px] text-ink">{body}</Text>
          )}
          <Text className="mt-1 font-body-extrabold text-xs text-ink-soft">
            {fmtDay(e.dateKey)}
          </Text>
        </View>
      </View>

      {editing ? (
        <View className="mt-3 flex-row gap-2">
          <MiniButton onPress={saveEdit} Icon={Check} label="Save" color={colors.accentDeep} />
          <MiniButton onPress={() => setEditing(false)} Icon={X} label="Cancel" color={colors.inkSoft} />
        </View>
      ) : (e.type === 'voice' && e.audioUri) ||
        (e.type === 'text' && (onShare || onSend)) ||
        canEdit ||
        onDelete ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
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
          {canEdit ? (
            <MiniButton onPress={startEdit} Icon={Pencil} label="Edit" color={colors.inkSoft} />
          ) : null}
          {onDelete ? (
            <MiniButton onPress={onDelete} Icon={Trash2} label="Delete" color={colors.inkSoft} />
          ) : null}
        </View>
      ) : null}

      {e.type === 'video' && e.videoUri ? (
        <Modal
          visible={videoOpen}
          animationType="fade"
          onRequestClose={closeVideo}
          supportedOrientations={['portrait', 'landscape']}
          statusBarTranslucent
        >
          <View className="flex-1" style={{ backgroundColor: '#000' }}>
            <Pressable style={{ flex: 1 }} onPress={toggleVideoPlaying}>
              <VideoView
                player={videoPlayer}
                style={{ flex: 1 }}
                contentFit="contain"
                nativeControls={false}
                allowsPictureInPicture
              />
            </Pressable>

            <LinearGradient
              colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
              pointerEvents="box-none"
              className="absolute left-0 right-0 top-0 flex-row items-start justify-between px-4"
              style={{ paddingTop: insets.top + 10, height: 100 }}
            >
              <Text className="mt-1.5 font-body-extrabold text-xs text-white/90">
                {fmtDay(e.dateKey)}
              </Text>
              <Pressable
                onPress={closeVideo}
                accessibilityLabel="Close video"
                hitSlop={10}
                className="h-9 w-9 items-center justify-center rounded-full bg-black/50"
              >
                <X size={18} color="#fff" />
              </Pressable>
            </LinearGradient>

            <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
              <View className="h-16 w-16 items-center justify-center rounded-full border border-white/55 bg-white/10">
                {videoPlaying ? (
                  <Pause size={26} color="#fff" />
                ) : (
                  <Play size={26} color="#fff" style={{ marginLeft: 3 }} />
                )}
              </View>
            </View>

            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.78)']}
              pointerEvents="box-none"
              className="absolute left-0 right-0 bottom-0 gap-2 px-4"
              style={{ paddingBottom: insets.bottom + 14, paddingTop: 56 }}
            >
              <Text className="font-serif-italic text-sm text-white/90" numberOfLines={2}>
                &ldquo;{body}&rdquo;
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="font-body-extrabold text-[10px] text-white/75">
                  {formatDuration(currentTime)}
                </Text>
                <Pressable
                  onPress={onScrub}
                  onLayout={(evt) => setTrackWidth(evt.nativeEvent.layout.width)}
                  className="h-4 flex-1 justify-center"
                >
                  <View className="h-1 overflow-hidden rounded-full bg-white/25">
                    <View className="h-1 rounded-full bg-accent" style={{ width: `${progress}%` }} />
                  </View>
                </Pressable>
                <Text className="font-body-extrabold text-[10px] text-white/75">
                  {formatDuration(duration)}
                </Text>
              </View>
              <Text className="font-serif-italic text-xs text-white/70">the happy you</Text>
            </LinearGradient>
          </View>
        </Modal>
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
