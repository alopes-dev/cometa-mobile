import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';
import type { Theme } from '@/components/design-system/ThemeProvider';
import type { PromotionTone } from '../../types';

export const BANNER_HEIGHT = 136;
export const BANNER_IMAGE_SIZE = 112;

/**
 * Both tones resolve through the `promo` roles rather than naming a colour.
 *
 * `featured` is the board's green banner and `limited` its amber one. Note
 * that the amber tone's label is *not* white: `promo.limited.fill` is a
 * fill-only step (2.30:1 against white), so the palette pairs it with a
 * near-black `onFill`. The board draws white there; following it would ship
 * a banner whose headline fails AA, so the token wins.
 */
export const toneFill = (theme: Theme, tone: PromotionTone): string =>
  theme.colors.promo[tone].fill;

export const toneOnFill = (theme: Theme, tone: PromotionTone): string =>
  theme.colors.promo[tone].onFill;

export const Container = styled.View<{ tone: PromotionTone }>`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[12]}px;
  height: ${BANNER_HEIGHT}px;
  padding: ${({ theme }) => theme.spacing[16]}px;
  border-radius: ${({ theme }) => theme.radius.xxl}px;
  overflow: hidden;
  background-color: ${({ theme, tone }) => toneFill(theme, tone)};
  ${continuousCorners}
`;

export const Message = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

/** The CTA reads as a chip on the fill, so it takes the surface colour. */
export const Cta = styled.View`
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[12]}px;
  padding-vertical: ${({ theme }) => theme.spacing[6]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.surface.primary};
`;
