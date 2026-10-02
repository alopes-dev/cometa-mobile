import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';

export const TILE_WIDTH = 68;

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Tile = styled.View`
  width: ${TILE_WIDTH}px;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]}px;
`;

/**
 * The 58px rounded square the board draws behind each craving icon
 * (node 48:19803). `selected` tints it with the brand rather than swapping
 * the icon, so the row reads as one set whichever tile is active.
 */
export const IconTile = styled.View<{ selected: boolean }>`
  width: 58px;
  height: 58px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.surface.selected : theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme, selected }) =>
    selected ? theme.colors.border.selected : theme.colors.border.subtle};
  ${continuousCorners}
`;
