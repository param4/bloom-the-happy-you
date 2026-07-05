import { useClerk } from '@clerk/clerk-expo';
import { Flower2, LogOut, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import type { Profile } from '@/domain/profile';
import type { ThemeKey } from '@/domain/theme';
import { useProfileStore } from '@/state/profileStore';
import { useThemeStore } from '@/state/themeStore';
import { useTheme } from '@/theme/ThemeProvider';
import { shadows } from '@/theme/shadows';

interface GreetingHeaderProps {
  profile: Profile;
  onClearData(): void;
}

const THEME_SWATCHES: { key: ThemeKey; label: string; color: string }[] = [
  { key: 'terracotta', label: 'Terracotta', color: '#B26647' },
  { key: 'sage', label: 'Sage', color: '#7E9A6F' },
  { key: 'blush', label: 'Blush', color: '#C07D6E' },
];

/** Bloom wordmark + avatar with the theme picker and clear-data popover. */
export function GreetingHeader({ profile, onClearData }: GreetingHeaderProps) {
  const { colors, gradients } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = (profile.name || 'friend').split(' ')[0];

  const themeKey = useThemeStore((s) => s.themeKey);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { signOut: clerkSignOut } = useClerk();

  // Guests have no Clerk account (no id); sign them out locally. Clerk-backed
  // accounts sign out of Clerk, and ClerkProfileSync clears the local profile.
  const signOut = () => {
    setMenuOpen(false);
    if (profile.id) void clerkSignOut();
    else void useProfileStore.getState().signOut();
  };

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
      <Flower2 size={30} color={colors.accent} />
      <View className="flex-1">
        <Text className="font-serif text-xl leading-6 text-ink">Bloom</Text>
        <Text className="font-serif-italic text-xs text-ink-soft">The happy you</Text>
      </View>

      <Pressable onPress={() => setMenuOpen(true)} accessibilityLabel="Your profile">
        {profile.avatarUrl ? (
          <Image
            source={{ uri: profile.avatarUrl }}
            className="h-[42px] w-[42px] rounded-full"
            style={shadows.softer}
          />
        ) : (
          <GradientCard
            colors={gradients.accentSun}
            className="h-[42px] w-[42px] items-center justify-center rounded-full"
            style={shadows.softer}
          >
            <Text className="font-serif text-[17px] text-white">
              {firstName[0]?.toUpperCase()}
            </Text>
          </GradientCard>
        )}
      </Pressable>

      {/* profile popover — full-screen scrim dismisses */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable className="flex-1" onPress={() => setMenuOpen(false)}>
          <View
            className="absolute right-5 top-24 w-[236px] rounded-2xl border border-line bg-card p-3.5"
            style={shadows.soft}
          >
            <Text className="font-serif text-[15px] text-ink">{profile.name || 'Guest'}</Text>
            <Text className="mb-3 font-body text-xs text-ink-soft">
              {profile.email || 'Exploring as a guest'}
            </Text>

            <Text className="mb-2 font-body-extrabold text-[11px] uppercase tracking-widest text-ink-soft">
              Theme
            </Text>
            <View className="mb-3.5 flex-row gap-2.5">
              {THEME_SWATCHES.map(({ key, label, color }) => {
                const active = themeKey === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setTheme(key)}
                    accessibilityLabel={label}
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: color,
                      borderWidth: active ? 2 : 0,
                      borderColor: colors.ink,
                    }}
                  />
                );
              })}
            </View>

            <Pressable
              onPress={confirmClear}
              className="mb-2 flex-row items-center justify-center gap-2 rounded-xl border border-line bg-cream py-2"
            >
              <Trash2 size={16} color={colors.accentDeep} />
              <Text className="font-body-extrabold text-[13px] text-accent-deep">Clear data</Text>
            </Pressable>

            <Pressable
              onPress={signOut}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-line bg-cream py-2"
            >
              <LogOut size={16} color={colors.ink} />
              <Text className="font-body-extrabold text-[13px] text-ink">
                {profile.id ? 'Sign out' : 'Leave guest mode'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
