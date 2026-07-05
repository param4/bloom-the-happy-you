import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { useToastStore } from '@/state/toastStore';
import { shadows } from '@/theme/shadows';

/** Toast host — rendered once above the navigator. */
export function ToastHost() {
  const message = useToastStore((s) => s.message);
  if (!message) return null;

  return (
    <View pointerEvents="none" className="absolute bottom-[96px] left-0 right-0 items-center">
      <Animated.View
        entering={FadeInDown.duration(300)}
        exiting={FadeOutDown.duration(200)}
        className="max-w-[88%] rounded-full bg-ink px-5 py-3"
        style={shadows.soft}
      >
        <Text className="text-center font-body-semibold text-sm text-white">{message}</Text>
      </Animated.View>
    </View>
  );
}
