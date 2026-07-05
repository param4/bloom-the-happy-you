import { Flower2, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import type { Profile } from '@/domain/profile';
import { colors } from '@/theme/colors';
import { gradients } from '@/theme/gradients';
import { shadows } from '@/theme/shadows';

interface GreetingHeaderProps {
  profile: Profile;
  onClearData(): void;
}

/** Bloom wordmark + avatar with the clear-data popover. */
export function GreetingHeader({ profile, onClearData }: GreetingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = (profile.name || 'friend').split(' ')[0];

  const confirmClear = () => {
    setMenuOpen(false);
    Alert.alert(
      'Clear all data?',
      'This permanently removes your journals, todos, vision board, booth moments and streak. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear data', style: 'destructive', onPress: onClearData },
      ],
    );
  };

  return (
    <View className="flex-row items-center gap-2.5">
      <Flower2 size={30} color={colors.peach} />
      <View className="flex-1">
        <Text className="font-display text-xl leading-6 text-ink">Bloom</Text>
        <Text className="font-body-italic text-xs text-ink-soft">Meet the happy you</Text>
      </View>

      <Pressable onPress={() => setMenuOpen(true)} accessibilityLabel="Your profile">
        <GradientCard
          colors={gradients.peachSun}
          className="h-[42px] w-[42px] items-center justify-center rounded-full"
          style={shadows.softer}
        >
          <Text className="font-display text-[17px] text-white">
            {firstName[0]?.toUpperCase()}
          </Text>
        </GradientCard>
      </Pressable>

      {/* profile popover — full-screen scrim dismisses */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable className="flex-1" onPress={() => setMenuOpen(false)}>
          <View
            className="absolute right-5 top-24 w-[220px] rounded-2xl border border-line bg-white p-3.5"
            style={shadows.soft}
          >
            <Text className="font-display text-[15px] text-ink">{profile.name || 'Guest'}</Text>
            <Text className="mb-3 font-body text-xs text-ink-soft">
              {profile.email || 'Exploring as a guest'}
            </Text>
            <Pressable
              onPress={confirmClear}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-peach bg-cream py-2"
            >
              <Trash2 size={16} color={colors.peachDeep} />
              <Text className="font-display text-[13px] text-peach-deep">Clear data</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
