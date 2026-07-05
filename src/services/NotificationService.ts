import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { ReminderTime } from '@/domain/settings';

import type { INotificationService } from './interfaces';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = 'reminders';

/** Wraps expo-notifications — nothing else in the app imports it. */
export class NotificationService implements INotificationService {
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Gentle reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  }

  async scheduleDaily(time: ReminderTime): Promise<string> {
    return Notifications.scheduleNotificationAsync({
      content: {
        title: 'A quiet moment for you 🌸',
        body: 'Visit your vision — breathe with what you’re calling in.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute,
        channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
      },
    });
  }

  async cancel(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
