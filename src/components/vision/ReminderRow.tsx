import DateTimePicker from '@react-native-community/datetimepicker';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useDailyReminder } from '@/hooks/useDailyReminder';
import { colors } from '@/theme/colors';

/** Daily reminder row — a gentle nudge to visit your vision. */
export function ReminderRow() {
  const { time, updateTime, permissionDenied } = useDailyReminder();
  const [pickerOpen, setPickerOpen] = useState(false);

  const asDate = new Date();
  asDate.setHours(time?.hour ?? 8, time?.minute ?? 0, 0, 0);

  const label = time
    ? `${`${time.hour}`.padStart(2, '0')}:${`${time.minute}`.padStart(2, '0')}`
    : '--:--';

  return (
    <Card className="mb-5 rounded-[18px] p-4">
      <View className="flex-row items-center gap-3">
        <Bell size={20} color={colors.peachDeep} />
        <View className="flex-1">
          <Text className="font-display text-[15px] text-ink">Daily reminder</Text>
          <Text className="font-body text-xs text-ink-soft">
            A gentle nudge to visit your vision.
          </Text>
        </View>
        <Pressable
          onPress={() => setPickerOpen(true)}
          className="rounded-xl border border-line px-2.5 py-2"
        >
          <Text className="font-body text-[15px] text-ink">{label}</Text>
        </Pressable>
      </View>

      {permissionDenied && (
        <Text className="mt-2 font-body text-xs text-peach-deep">
          Notifications are off for Bloom — enable them in Settings to get your nudge.
        </Text>
      )}

      {(pickerOpen || Platform.OS === 'ios') && pickerOpen && (
        <DateTimePicker
          value={asDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setPickerOpen(false);
            if (event.type === 'set' && date) {
              updateTime({ hour: date.getHours(), minute: date.getMinutes() });
            }
          }}
        />
      )}
    </Card>
  );
}
