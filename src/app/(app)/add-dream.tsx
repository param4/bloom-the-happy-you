import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Field } from '@/components/ui/Field';
import { SoftButton } from '@/components/ui/SoftButton';
import { haptics } from '@/lib/haptics';
import { TopBar } from '@/components/ui/TopBar';
import { useServices } from '@/providers/ServicesProvider';
import { useManifestationsStore } from '@/state/manifestationsStore';
import { useToastStore } from '@/state/toastStore';
import { useTheme } from '@/theme/ThemeProvider';

export default function AddDreamScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { media } = useServices();
  const add = useManifestationsStore((s) => s.add);
  const update = useManifestationsStore((s) => s.update);
  const remove = useManifestationsStore((s) => s.remove);
  const flash = useToastStore((s) => s.flash);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useManifestationsStore((s) => s.manifestations.find((m) => m.id === id));
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [affirmation, setAffirmation] = useState(existing?.affirmation ?? '');
  const [why, setWhy] = useState(existing?.why ?? '');
  const [imageUri, setImageUri] = useState<string | undefined>(existing?.imageUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
  };

  const save = async () => {
    if (!title.trim() || !affirmation.trim()) return;
    // Persist only a freshly picked (volatile cache) URI; keep an unchanged
    // durable one as-is, and treat a cleared image as removed.
    const durableUri =
      imageUri && imageUri !== existing?.imageUri
        ? await media.persistImage(imageUri)
        : imageUri;
    const draft = {
      title: title.trim(),
      affirmation: affirmation.trim(),
      why: why.trim(),
      imageUri: durableUri,
    };
    if (isEdit) await update(existing.id, draft);
    else await add(draft);
    haptics.success();
    flash(isEdit ? 'Dream updated ✨' : 'Added to your vision board ✨');
    router.back();
  };

  const confirmDelete = () => {
    if (!existing) return;
    Alert.alert('Delete this dream?', 'It will be removed from your vision board. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await remove(existing.id);
          haptics.success();
          flash('Dream removed');
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-cream"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar title={isEdit ? 'Edit dream' : 'Add a dream'} />
      <ScrollView
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-3 font-body text-[13px] text-ink-soft">
          Write your affirmation as if it's already true.
        </Text>

        <Pressable
          onPress={pickImage}
          className="mb-3 h-[110px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-cream"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Camera size={18} color={colors.inkSoft} />
              <Text className="font-body-extrabold text-sm text-ink-soft">Add a picture</Text>
            </View>
          )}
        </Pressable>

        <Field
          label="What are you manifesting?"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. My calm, light-filled home"
        />
        <Field
          label="Affirmation (present tense)"
          value={affirmation}
          onChangeText={setAffirmation}
          placeholder="I am…"
          hint='Tip: "I am…" works better than "I will…"'
        />
        <Field
          label="Why it matters (optional)"
          value={why}
          onChangeText={setWhy}
          placeholder="A word to future me"
        />

        <View className="mt-2 flex-row gap-2.5">
          <SoftButton primary onPress={save} className="flex-1">
            {isEdit ? 'Save changes' : 'Add it'}
          </SoftButton>
          <SoftButton ghost onPress={() => router.back()}>Cancel</SoftButton>
        </View>

        {isEdit && (
          <Pressable
            onPress={confirmDelete}
            className="mt-3 flex-row items-center justify-center gap-2 py-2"
          >
            <Trash2 size={16} color={colors.accentDeep} />
            <Text className="font-body-extrabold text-[13px] text-accent-deep">Delete dream</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
