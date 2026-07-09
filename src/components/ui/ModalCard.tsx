import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

interface ModalCardProps {
  /** Darker scrim (used by the manifestation moment). */
  dim?: boolean;
}

/**
 * Shared chrome for transparentModal routes: scrim + cream sheet + close
 * button. Tapping the scrim or the X dismisses via router.back().
 */
export function ModalCard({ dim, children }: PropsWithChildren<ModalCardProps>) {
  const router = useRouter();
  return (
    <Animated.View entering={FadeIn.duration(250)} className="flex-1">
      <Pressable
        className="flex-1 items-center justify-center p-5"
        style={{ backgroundColor: dim ? 'rgba(62,58,53,0.55)' : 'rgba(62,58,53,0.4)' }}
        onPress={() => router.back()}
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-[400px]">
          <View
            className="max-h-[640px] rounded-[26px] bg-cream p-[22px]"
            style={shadows.soft}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {children}
            </ScrollView>
            <Pressable
              onPress={() => router.back()}
              className="absolute right-3.5 top-3.5 h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-white"
              style={shadows.softer}
              accessibilityLabel="Close"
            >
              <X size={18} color={colors.ink} />
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
