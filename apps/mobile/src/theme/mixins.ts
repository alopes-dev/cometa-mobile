import { css } from 'styled-components/native';
import type { ShadowLevel } from './shadows';

/**
 * Applies an elevation level from the theme.
 *
 * Reads both the geometry and the shadow color from the active scheme, so a
 * component never names a shadow color itself and dark mode can soften or
 * strengthen depth centrally.
 *
 *   const Card = styled.View`
 *     ${elevate('sm')}
 *   `;
 */
export const elevate = (level: ShadowLevel) => css`
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px ${({ theme }) => theme.shadows[level].offsetY}px;
  shadow-opacity: ${({ theme }) => theme.shadows[level].opacity};
  shadow-radius: ${({ theme }) => theme.shadows[level].radius}px;
  elevation: ${({ theme }) => theme.shadows[level].elevation};
`;

/**
 * Applies a typography variant from the theme.
 *
 * Keeps every text style anchored to the ramp — the alternative is the
 * `font-size: 13px` literals that had accumulated across feature components.
 */
export const textStyle = (variant: keyof import('./typography').Typography) => css`
  font-family: ${({ theme }) => theme.typography[variant].fontFamily};
  font-size: ${({ theme }) => theme.typography[variant].fontSize}px;
  line-height: ${({ theme }) => theme.typography[variant].lineHeight}px;
  letter-spacing: ${({ theme }) => theme.typography[variant].letterSpacing}px;
`;

/**
 * iOS squircle corners. Pair with any non-capsule radius; `continuous` is a
 * no-op on Android, so it is safe to apply unconditionally.
 */
export const continuousCorners = css`
  border-curve: continuous;
`;
