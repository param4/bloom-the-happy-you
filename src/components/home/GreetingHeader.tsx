import { Flower2, LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import type { Profile } from '@/domain/profile';
import { colors } from '@/theme/colors';
import { gradients } from '@/theme/gradients';
import { shadows } from '@/theme/shadows';

interface GreetingHeaderProps {
  profile: Profile;
  onSignOut(): void;
}

/** Bloom wordmark + avatar with the sign-out popover. */
export function GreetingHeader({ profile, onSignOut }: GreetingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = (profile.name || 'friend').split(' ')[0];

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
              onPress={() => {
                setMenuOpen(false);
                onSignOut();
              }}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-line bg-cream py-2"
            >
              <LogOut size={16} color={colors.ink} />
              <Text className="font-display text-[13px] text-ink">Sign out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
