import styled, { useTheme } from 'styled-components/native';
import { OnboardingIcon } from '@/features/onboarding/components/OnboardingIcon';
import { brand, icon } from '../../assets';

/** `Welcome visual` — node 74:24628. */
const Panel = styled.View`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: ${({ theme }) => theme.auth.metrics.visualHeight}px;
  border-radius: ${({ theme }) => theme.auth.metrics.visualRadius}px;
  background-color: ${({ theme }) => theme.auth.color.surfaceSubtle};
`;

/**
 * `Ambient circle` — nodes 74:24629 and 74:24630.
 *
 * Both are drawn hanging off the panel's corners, which is the whole effect —
 * the panel clips them, so the soft shapes read as bleeding in from outside.
 * Positioned absolutely because that overhang is the design, not a layout the
 * children should influence.
 */
const AmbientLarge = styled.View`
  position: absolute;
  right: -36px;
  top: -42px;
`;

const AmbientSmall = styled.View`
  position: absolute;
  left: -28px;
  bottom: -44px;
`;

/** `Local marketplace motif` — node 74:24631. Bottom-aligned, as drawn. */
const Motif = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.auth.metrics.tileGap}px;
`;

/** `Marketplace tile` — nodes 74:24632, 74:24634, 74:24636. */
const Tile = styled.View<{ size: number; fill: string }>`
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ theme }) => theme.auth.metrics.tileRadius}px;
  background-color: ${({ fill }) => fill};
`;

/**
 * The illustration above the welcome copy — node 74:24628.
 *
 * The three tiles are the marketplace's three categories at three sizes, with
 * the largest in the middle; that staggering is why they are written out
 * rather than mapped over one size.
 *
 * Decorative as a whole: it repeats what the title says, so it is hidden from
 * assistive tech instead of being given a label that would be read twice.
 */
export function WelcomeVisual() {
  const theme = useTheme();
  const { metrics, color } = theme.auth;

  return (
    <Panel accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <AmbientLarge>
        <OnboardingIcon source={brand.ambientCircleLarge} size={metrics.ambientLargeSize} />
      </AmbientLarge>
      <AmbientSmall>
        <OnboardingIcon source={brand.ambientCircleSmall} size={metrics.ambientSmallSize} />
      </AmbientSmall>
      <Motif>
        <Tile size={metrics.tileSizeSmall} fill={color.tileFood}>
          <OnboardingIcon source={icon.utensils} size={metrics.tileIconSize} />
        </Tile>
        <Tile size={metrics.tileSizeLarge} fill={color.tileGoods}>
          <OnboardingIcon source={icon.shoppingBag} size={metrics.tileIconSize} />
        </Tile>
        <Tile size={metrics.tileSizeMedium} fill={color.tileParcels}>
          <OnboardingIcon source={icon.package} size={metrics.tileIconSize} />
        </Tile>
      </Motif>
    </Panel>
  );
}
