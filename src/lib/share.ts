import { Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import type { RefObject } from 'react';
import type { View } from 'react-native';

/**
 * Cross-platform share helpers. Image cards are rendered as normal RN views
 * (no HTML canvas), captured with react-native-view-shot, then handed to the
 * OS share sheet via expo-sharing.
 */

/** Share plain text (appreciation messages) through the native share sheet. */
export async function shareText(message: string): Promise<void> {
  await Share.share({ message });
}

/** Capture a view to a PNG and open the share sheet; returns false if unsupported. */
export async function captureAndShare(
  ref: RefObject<View | null>,
  fileName = 'bloom-card',
): Promise<boolean> {
  if (!ref.current) return false;
  const uri = await captureRef(ref, { format: 'png', quality: 1, fileName });
  if (!(await Sharing.isAvailableAsync())) return false;
  await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your Bloom card' });
  return true;
}

/** Share an existing file (e.g. a recorded video) through the OS sheet. */
export async function shareFile(uri: string, mimeType = 'video/mp4'): Promise<boolean> {
  if (!(await Sharing.isAvailableAsync())) return false;
  await Sharing.shareAsync(uri, { mimeType, dialogTitle: 'Share your moment' });
  return true;
}
