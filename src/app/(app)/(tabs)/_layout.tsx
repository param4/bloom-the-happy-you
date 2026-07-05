import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import {
  Home as HomeIcon,
  ListChecks,
  Quote,
  Sparkles,
  Video,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/theme/fonts';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Material top-tabs navigator (pager-backed, so screens swipe horizontally),
 * pinned to the bottom and styled to look like the prototype's bottom bar.
 * Swiping moves between adjacent tabs (Home ⇄ Today ⇄ Vision ⇄ Booth ⇄ Affirm).
 */
const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarActiveTintColor: colors.accentDeep,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { height: 0 },
        tabBarStyle: {
          backgroundColor: 'rgba(252,247,236,0.94)',
          borderTopColor: colors.line,
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyExtraBold,
          fontSize: 11,
          textTransform: 'none',
          marginTop: 2,
        },
        tabBarItemStyle: { flexDirection: 'column', paddingVertical: 4 },
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon size={22} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <ListChecks size={22} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="vision"
        options={{
          title: 'Vision',
          tabBarIcon: ({ color }) => <Sparkles size={22} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="booth"
        options={{
          title: 'Booth',
          tabBarIcon: ({ color }) => <Video size={22} color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="affirmations"
        options={{
          title: 'Affirm',
          tabBarIcon: ({ color }) => <Quote size={22} color={color} />,
        }}
      />
    </MaterialTopTabs>
  );
}
