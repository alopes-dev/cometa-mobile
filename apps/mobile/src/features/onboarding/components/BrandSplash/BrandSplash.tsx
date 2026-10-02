import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { brandMark } from '../../assets';
import {
  Root,
  LogoRow,
  Mark,
  SpeedLines,
  SpeedLine,
  Plate,
  Food,
  Wordmark,
  Loader,
  LoaderDot,
} from './BrandSplash.styles';

/** `Speed line` widths, node 45:27 to 45:29. */
const SPEED_LINE_WIDTHS = [11.04, 7.68, 9.6];

const DOT_COUNT = 4;
/** Figma draws the second dot elongated; that frame is the resting state. */
const RESTING_DOT = 1;

/**
 * The branded boot screen — node 45:17.
 *
 * Replaces the blank frame the root layout used to hold while fonts and the
 * stored session resolve. The elongated dot travels along the row, because the
 * board draws a loader and a loader that never moves reads as a bug; with
 * Reduce Motion on it simply rests on the frame as drawn.
 */
export function BrandSplash() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(RESTING_DOT);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(
      () => setActive((current) => (current + 1) % DOT_COUNT),
      theme.motion.duration.base
    );
    return () => clearInterval(interval);
  }, [reducedMotion, theme.motion.duration.base]);

  // Derived rather than written back through `setActive`, so turning Reduce
  // Motion on mid-animation settles the row without a render triggered from
  // inside the effect.
  const lit = reducedMotion ? RESTING_DOT : active;

  return (
    <Root accessibilityRole="progressbar" accessibilityLabel="A carregar a Kometa">
      <LogoRow>
        <Mark>
          <SpeedLines>
            {SPEED_LINE_WIDTHS.map((width) => (
              <SpeedLine key={width} width={width} />
            ))}
          </SpeedLines>
          <Plate source={brandMark.plate} contentFit="contain" />
          <Food source={brandMark.food} contentFit="contain" />
        </Mark>
        <Wordmark>Kometa</Wordmark>
      </LogoRow>
      <Loader accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: DOT_COUNT }, (_, index) => (
          <LoaderDot key={index} active={index === lit} />
        ))}
      </Loader>
    </Root>
  );
}
