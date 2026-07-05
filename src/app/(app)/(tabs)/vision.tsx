import { useRouter } from 'expo-router';
import { Plus, Wand2 } from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';

import { DreamCard } from '@/components/vision/DreamCard';
import { ManifestedRow } from '@/components/vision/ManifestedRow';
import { ReminderRow } from '@/components/vision/ReminderRow';
import { GradientCard } from '@/components/ui/GradientCard';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TopBar } from '@/components/ui/TopBar';
import { haptics } from '@/lib/haptics';
import { useManifestationsStore } from '@/state/manifestationsStore';
import { useToastStore } from '@/state/toastStore';
import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

export default function VisionScreen() {
  const router = useRouter();
  const { colors, gradients } = useTheme();
  const manifestations = useManifestationsStore((s) => s.manifestations);
  const setAchieved = useManifestationsStore((s) => s.setAchieved);
  const remove = useManifestationsStore((s) => s.remove);
  const flash = useToastStore((s) => s.flash);

  const active = manifestations.filter((m) => !m.achieved);
  const done = manifestations.filter((m) => m.achieved);

  const onAchieved = async (id: string) => {
    await setAchieved(id, true);
    haptics.celebrate();
    flash('Moved to Manifested ✨');
  };

  const onUndo = async (id: string) => {
    await setAchieved(id, false);
    haptics.select();
    flash('Back to what you’re calling in');
  };

  const onDelete = (id: string, title: string) => {
    Alert.alert('Delete this dream?', `"${title}" will be removed from your vision board. This cannot be undone.`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, delete',
        style: 'destructive',
        onPress: async () => {
          await remove(id);
          flash('Dream removed');
        },
      },
    ]);
  };

  // two-column grid rows: active dreams + the trailing "add" card
  const cells: (typeof active[number] | 'add')[] = [...active, 'add'];
  const rows: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 2) rows.push(cells.slice(i, i + 2));

  return (
    <Screen padBottom={48}>
      <TopBar title="Vision Board" />
      <View className="px-5">
        <Pressable
          onPress={() => router.push('/(app)/manifestation-moment')}
          className="mb-4"
          style={shadows.soft}
        >
          <GradientCard
            colors={gradients.accentSun}
            className="flex-row items-center gap-2.5 rounded-[20px] p-4"
          >
            <Wand2 size={22} color="#fff" />
            <Text className="flex-1 font-serif text-[17px] text-white">
              Take today's manifestation moment
            </Text>
          </GradientCard>
        </Pressable>

        <ReminderRow />

        <SectionLabel>What I'm calling in</SectionLabel>
        <View className="gap-3">
          {rows.map((row, i) => (
            <View key={i} className="flex-row gap-3">
              {row.map((cell) =>
                cell === 'add' ? (
                  <Pressable
                    key="add"
                    onPress={() => router.push('/(app)/add-dream')}
                    className="min-h-[180px] flex-1 items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-accent"
                  >
                    <Plus size={26} color={colors.accentDeep} />
                    <Text className="font-body-extrabold text-[13px] text-accent-deep">
                      Add a dream
                    </Text>
                  </Pressable>
                ) : (
                  <DreamCard
                    key={cell.id}
                    dream={cell}
                    onMarkAchieved={() => onAchieved(cell.id)}
                    onEdit={() =>
                      router.push({ pathname: '/(app)/add-dream', params: { id: cell.id } })
                    }
                    onDelete={() => onDelete(cell.id, cell.title)}
                  />
                ),
              )}
              {row.length === 1 && <View className="flex-1" />}
            </View>
          ))}
        </View>

        {done.length > 0 && (
          <View className="mt-6">
            <SectionLabel>Manifested ✨ — dreams now real</SectionLabel>
            <View className="gap-2.5">
              {done.map((dream) => (
                <ManifestedRow key={dream.id} dream={dream} onUndo={() => onUndo(dream.id)} />
              ))}
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
