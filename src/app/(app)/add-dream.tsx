import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Field } from '@/components/ui/Field';
import { SoftButton } from '@/components/ui/SoftButton';
import { haptics } from '@/lib/haptics';
import { TopBar } from '@/components/ui/TopBar';
import { useServices } from '@/providers/ServicesProvider';
import { useManifestationsStore } from '@/state/manifestationsStore';
import { useToastStore } from '@/state/toastStore';
import { colors } from '@/theme/colors';

export default function AddDreamScreen() {
  const router = useRouter();
  const { media } = useServices();
  const add = useManifestationsStore((s) => s.add);
  const flash = useToastStore((s) => s.flash);

  const [title, setTitle] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [why, setWhy] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();

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
    // Picker URIs are volatile cache files — persist before storing.
    const durableUri = imageUri ? await media.persistImage(imageUri) : undefined;
    await add({
      title: title.trim(),
      affirmation: affirmation.trim(),
      why: why.trim(),
      imageUri: durableUri,
    });
    haptics.success();
    flash('Added to your vision board ✨');
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-cream"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar title="Add a dream" tint={colors.lavDeep} />
      <ScrollView contentContainerClassName="px-5 pb-10" keyboardShouldPersistTaps="handled">
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
              <Text className="font-display text-sm text-ink-soft">Add a picture</Text>
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
            Add it
          </SoftButton>
          <SoftButton onPress={() => router.back()}>Cancel</SoftButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
