import { CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';

/**
 * Register third-party components with NativeWind so they accept className.
 * Imported once from the root layout for its side effects.
 */
cssInterop(LinearGradient, { className: 'style' });
cssInterop(CameraView, { className: 'style' });
cssInterop(VideoView, { className: 'style' });
