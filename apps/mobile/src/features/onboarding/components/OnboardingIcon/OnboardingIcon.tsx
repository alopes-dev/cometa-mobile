import { Image } from 'expo-image';

export type OnboardingIconProps = {
  /** A `require`d SVG from `features/onboarding/assets`. */
  source: number;
  /**
   * The icon's intrinsic size, which in every case equals the slot it fills in
   * the design. Passed explicitly so the box is reserved before the SVG
   * decodes, rather than collapsing and then jumping.
   */
  size: number;
  /**
   * Recolours the glyph where the design makes its colour stateful — the
   * category grid draws the same icon green when selected and grey when not.
   * Left undefined, the colour exported in the SVG is what renders.
   */
  tintColor?: string;
  accessibilityLabel?: string;
};

/**
 * Renders one of the exported Lucide SVGs at its natural size.
 *
 * `expo-image` decodes SVG on both platforms, which is what lets these ship as
 * the files Figma produced instead of being redrawn as `react-native-svg`
 * elements — the project has no SVG transformer, and hand-porting the paths
 * would put a second, drifting copy of each glyph in the repo.
 */
export function OnboardingIcon({
  source,
  size,
  tintColor,
  accessibilityLabel,
}: OnboardingIconProps) {
  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      contentFit="contain"
      tintColor={tintColor}
      accessible={accessibilityLabel !== undefined}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
