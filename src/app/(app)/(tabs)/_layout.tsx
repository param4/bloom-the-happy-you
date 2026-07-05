import { Tabs } from 'expo-router';
import {
  Home as HomeIcon,
  ListChecks,
  Quote,
  Sparkles,
  Video,
} from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

/** The five-tab bottom navigation from the prototype. */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.cream },
        tabBarActiveTintColor: colors.peachDeep,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderTopColor: colors.line,
        },
        tabBarLabelStyle: { fontFamily: fonts.display, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <ListChecks size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vision"
        options={{
          title: 'Vision',
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="booth"
        options={{
          title: 'Booth',
          tabBarIcon: ({ color, size }) => <Video size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="affirmations"
        options={{
          title: 'Affirm',
          tabBarIcon: ({ color, size }) => <Quote size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
