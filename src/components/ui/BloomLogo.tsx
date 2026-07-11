import Svg, { Circle, Path } from 'react-native-svg';

interface BloomLogoProps {
  /** Rendered width & height in px. */
  size?: number;
  /** Stroke color for the whole mark. */
  color?: string;
  strokeWidth?: number;
  /** Draw the enclosing circle badge around the flower. */
  ring?: boolean;
}

/**
 * The Bloom brand mark — a four-petal flower on a stem with two leaves,
 * drawn as line-art so it recolors via the `color` prop like a lucide icon.
 * Pass `ring` for the enclosed-badge treatment (app icon / splash).
 */
export function BloomLogo({ size = 24, color = '#4F6A2E', strokeWidth = 2, ring = false }: BloomLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {ring ? (
        <Circle cx={12} cy={12} r={11} stroke={color} strokeWidth={strokeWidth} />
      ) : null}

      {/* four petals */}
      <Circle cx={9.5} cy={6.2} r={2.6} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={14.5} cy={6.2} r={2.6} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={9.5} cy={11} r={2.6} stroke={color} strokeWidth={strokeWidth} />
      <Circle cx={14.5} cy={11} r={2.6} stroke={color} strokeWidth={strokeWidth} />
      {/* center */}
      <Circle cx={12} cy={8.6} r={1.15} stroke={color} strokeWidth={strokeWidth} />

      {/* stem */}
      <Path
        d="M12 12.6V20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* two leaves */}
      <Path
        d="M12 18.4C12 16.2 10.2 14.6 7.6 14.6C7.6 16.8 9.4 18.4 12 18.4Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18.4C12 16.2 13.8 14.6 16.4 14.6C16.4 16.8 14.6 18.4 12 18.4Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
