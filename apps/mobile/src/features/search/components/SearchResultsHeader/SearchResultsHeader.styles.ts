import styled from 'styled-components/native';
import { elevate } from '@/theme';

/** Node 48:20164 — the back disc, the same 40pt as the bell beside it. */
export const BACK_SIZE = 40;
export const BACK_ICON_SIZE = 19;

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[12]}px;
`;

/**
 * A disc here, where the focused screen draws a bare chevron: that screen has
 * one thing on it and this one scrolls a feed under the header, so the
 * control needs its own surface to stay legible. The hairline carries most of
 * the separation and the shadow only confirms it, which is the order §22
 * asks for.
 */
export const BackButton = styled.View`
  width: ${BACK_SIZE}px;
  height: ${BACK_SIZE}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface.elevated};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
  ${elevate('sm')}
`;

export const Title = styled.View`
  flex: 1;
`;
