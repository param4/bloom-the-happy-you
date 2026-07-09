import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  /** Disable scrolling for screens that manage their own layout. */
  scroll?: boolean;
  /** Extra bottom padding so content clears the tab bar. */
  padBottom?: number;
  /**
   * Add the bottom safe-area inset so content clears the Android system nav
   * bar. Only for full-screen routes (outside the tabs) — tab screens sit above
   * the tab bar, which already reserves the inset.
   */
  safeBottom?: boolean;
}

/** Cream page container with safe-area padding and the floatIn entrance. */
export function Screen({
  scroll = true,
  padBottom = 32,
  safeBottom = false,
  children,
}: PropsWithChildren<ScreenProps>) {
  const insets = useSafeAreaInsets();
  const bottom = padBottom + (safeBottom ? insets.bottom : 0);

  const content = (
    <Animated.View entering={FadeInDown.duration(450)} className="flex-1">
      {children}
    </Animated.View>
  );

  if (!scroll) {
    return (
      <View
        className="flex-1 bg-cream"
        style={{ paddingTop: insets.top, paddingBottom: safeBottom ? insets.bottom : 0 }}
      >
        {content}
      </View>
    );
  }
  return (
    <ScrollView
      className="flex-1 bg-cream"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: bottom }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}
