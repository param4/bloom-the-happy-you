import { Download, Share2 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { GradientCard } from '@/components/ui/GradientCard';
import { OverlayModal } from '@/components/ui/OverlayModal';
import { SoftButton } from '@/components/ui/SoftButton';
import { fmtLong, todayKey } from '@/lib/dates';
import { captureAndShare } from '@/lib/share';
import { useShareCardStore } from '@/state/shareCardStore';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * App-level shareable-image card. The card is a real RN view (no HTML canvas);
 * react-native-view-shot captures it to a PNG which expo-sharing hands to the
 * OS share sheet. Opened via the shareCard store from entries/affirmations/recap.
 */
export function ShareCardModal() {
  const item = useShareCardStore((s) => s.item);
  const close = useShareCardStore((s) => s.close);
  const { colors, gradients } = useTheme();
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);

  if (!item) return null;

  const save = async () => {
    setBusy(true);
    try {
      await captureAndShare(cardRef, 'bloom-card');
    } finally {
      setBusy(false);
    }
  };

  return (
    <OverlayModal visible={!!item} onClose={close}>
      <Text className="mb-1 font-serif text-[22px] text-ink">A card to share</Text>
      <Text className="mb-3 font-body text-[13px] text-ink-soft">
        Lovely on a Story — or just for you.
      </Text>

      {/* The captured card (1080×1350 look at ~4:5). */}
      <View className="overflow-hidden rounded-[18px] border border-line">
        <View ref={cardRef} collapsable={false}>
          <GradientCard colors={gradients.heroBadge} direction="diagonal">
            <View
              className="items-center px-7 py-9"
              style={{ borderWidth: 2, borderColor: `${colors.accent}55`, margin: 14, borderRadius: 4 }}
            >
              <Text className="font-serif text-[26px] text-accent-deep">Bloom</Text>
              <Text className="font-serif-italic text-[14px] text-ink-soft">
                the happy you
              </Text>
              <Text className="mb-4 mt-8 font-body-extrabold text-[13px] uppercase tracking-wide text-accent">
                {item.label}
              </Text>
              <Text className="text-center font-serif text-[26px] leading-[36px] text-ink">
                “{item.text}”
              </Text>
              <Text className="mt-8 font-body-bold text-[13px] text-ink-soft">
                {fmtLong(item.dateKey ?? todayKey())}
              </Text>
            </View>
          </GradientCard>
        </View>
      </View>

      <View className="mt-4 flex-row gap-2.5">
        <SoftButton primary raw onPress={save} disabled={busy} className="flex-1">
          <Download size={16} color="#fff" />
          <Text className="font-body-extrabold text-[15px] text-white">
            {busy ? 'Preparing…' : 'Save / Share'}
          </Text>
        </SoftButton>
        <SoftButton ghost raw onPress={close}>
          <Share2 size={16} color={colors.ink} />
          <Text className="font-body-extrabold text-[15px] text-ink">Close</Text>
        </SoftButton>
      </View>
    </OverlayModal>
  );
}
