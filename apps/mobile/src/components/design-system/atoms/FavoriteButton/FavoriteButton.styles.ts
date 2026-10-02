import styled, { css } from 'styled-components/native';
import { elevate } from '@/theme';

export type FavoriteButtonVariant = 'plain' | 'floating';

/**
 * `floating` is the form the button takes over photography (node 48:19836):
 * the translucent chip fill instead of an opaque surface and a hairline, so
 * the image reads through it. Mirrors `RatingBadge`'s variant on purpose —
 * the two sit in the same corner of the same card.
 */
export const Container = styled.View<{ size: number; variant: FavoriteButtonVariant }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  align-items: center;
  justify-content: center;
  ${({ theme, variant }) =>
    variant === 'floating'
      ? css`
          background-color: ${theme.colors.overlay.floating};
          ${elevate('sm')}
        `
      : css`
          background-color: ${theme.colors.background.primary};
          border-width: 1px;
          border-color: ${theme.colors.border.default};
        `}
`;
