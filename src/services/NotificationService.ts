import { Platform } from 'react-native';

import type { ReminderTime } from '@/domain/settings';

import type { INotificationService } from './interfaces';

/**
 * Wraps expo-notifications — nothing else in the app imports it.
 *
 * The native module is unavailable in Expo Go on Android (SDK 53+), where even
 * importing it and calling `setNotificationHandler` throws. Since the container
 * builds this service at app boot, we load expo-notifications LAZILY behind a
 * try/catch: if it can't load, every method degrades to a graceful no-op rather
 * than crashing the whole module graph. On a dev/prod build it works normally.
 */
type NotificationsModule = typeof import('expo-notifications');

const CHANNEL_ID = 'reminders';

let cached: NotificationsModule | null = null;
let handlerRegistered = false;

/** Lazily resolve expo-notifications; returns null when unavailable. */
function loadNotifications(): NotificationsModule | null {
  if (cached) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-notifications') as NotificationsModule;
    if (!handlerRegistered) {
      mod.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      handlerRegistered = true;
    }
    cached = mod;
    return mod;
  } catch {
    return null;
  }
}

export class NotificationService implements INotificationService {
  async requestPermission(): Promise<boolean> {
    const Notifications = loadNotifications();
    if (!Notifications) return false;
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
    const Notifications = loadNotifications();
    if (!Notifications) return '';
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
    const Notifications = loadNotifications();
    if (!Notifications || !notificationId) return;
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
