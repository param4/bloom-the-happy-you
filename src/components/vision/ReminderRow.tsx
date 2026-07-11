import DateTimePicker from '@react-native-community/datetimepicker';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SoftButton } from '@/components/ui/SoftButton';
import { useDailyReminder } from '@/hooks/useDailyReminder';
import { useTheme } from '@/theme/ThemeProvider';

/** Daily reminder row — a gentle nudge to visit your vision. */
export function ReminderRow() {
  const { colors } = useTheme();
  const { time, updateTime, permissionDenied } = useDailyReminder();
  const [pickerOpen, setPickerOpen] = useState(false);
  // Holds the in-progress selection so scrolling the wheels doesn't commit
  // (and reschedule the notification) until the user taps Save.
  const [draft, setDraft] = useState(new Date());

  const label = time
    ? `${`${time.hour}`.padStart(2, '0')}:${`${time.minute}`.padStart(2, '0')}`
    : '--:--';

  const openPicker = () => {
    const d = new Date();
    d.setHours(time?.hour ?? 8, time?.minute ?? 0, 0, 0);
    setDraft(d);
    setPickerOpen(true);
  };

  const commit = (d: Date) => {
    setPickerOpen(false);
    updateTime({ hour: d.getHours(), minute: d.getMinutes() });
  };

  return (
    <Card bordered className="mb-5 rounded-[18px] p-4">
      <View className="flex-row items-center gap-3">
        <Bell size={20} color={colors.accentDeep} />
        <View className="flex-1">
          <Text className="font-serif text-base text-ink">Daily reminder</Text>
          <Text className="font-body text-xs text-ink-soft">
            A gentle nudge to visit your vision.
          </Text>
        </View>
        <Pressable
          onPress={openPicker}
          className="rounded-xl border border-line bg-cream px-2.5 py-2"
        >
          <Text className="font-body text-[15px] text-ink">{label}</Text>
        </Pressable>
      </View>

      {permissionDenied && (
        <View className="mt-2 flex-row items-center gap-2.5">
          <Text className="flex-1 font-body text-xs text-accent-deep">
            Notifications are off for Bloom — your nudge can’t arrive until they’re enabled.
          </Text>
          <Pressable
            onPress={() => Linking.openSettings()}
            className="rounded-xl border border-line bg-cream px-2.5 py-2"
          >
            <Text className="font-body-extrabold text-xs text-ink">Open Settings</Text>
          </Pressable>
        </View>
      )}

      {/*
        iOS shows the spinner inline; scrolling only updates the draft, and the
        choice is committed on Save (or discarded on Cancel). Android uses its
        native dialog, which already has its own OK/Cancel and commits once.
      */}
      {pickerOpen && Platform.OS === 'ios' && (
        <View className="mt-3 border-t border-line pt-2">
          <DateTimePicker
            value={draft}
            mode="time"
            display="spinner"
            onChange={(_, date) => date && setDraft(date)}
          />
          <View className="mt-1 flex-row gap-2.5">
            <SoftButton ghost onPress={() => setPickerOpen(false)} className="flex-1">
              Cancel
            </SoftButton>
            <SoftButton primary onPress={() => commit(draft)} className="flex-1">
              Save
            </SoftButton>
          </View>
        </View>
      )}

      {pickerOpen && Platform.OS !== 'ios' && (
        <DateTimePicker
          value={draft}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setPickerOpen(false);
            if (event.type === 'set' && date) commit(date);
          }}
        />
      )}
    </Card>
  );
}
