import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';

/** Width of a card in a Home carousel (node 48:19831); full-width cards omit it. */
export const CARD_WIDTH = 250;
export const MEDIA_HEIGHT = 150;
export const FAVORITE_SIZE = 34;

export const Container = styled.View<{ width?: number }>`
  ${({ width }) => (width === undefined ? '' : `width: ${width}px;`)}
  gap: ${({ theme }) => theme.spacing[8]}px;
`;

export const ImageWrapper = styled.View`
  position: relative;
  height: ${MEDIA_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.media.placeholder};
  ${continuousCorners}
`;

/** The offer pill over the media, top-left (node 48:19834). */
export const PromotionBadge = styled.View`
  position: absolute;
  top: ${({ theme }) => theme.spacing[8]}px;
  left: ${({ theme }) => theme.spacing[8]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[8]}px;
  padding-vertical: ${({ theme }) => theme.spacing[4]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.promo.offer.fill};
`;

export const FavoriteSlot = styled.View`
  position: absolute;
  top: ${({ theme }) => theme.spacing[8]}px;
  right: ${({ theme }) => theme.spacing[8]}px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[8]}px;
`;

export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;
