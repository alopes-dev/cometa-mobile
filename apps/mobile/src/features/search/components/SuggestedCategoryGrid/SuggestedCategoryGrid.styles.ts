import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';

/** Node 48:20138 — the tile the glyph sits in. */
export const TILE_SIZE = 58;

/** Node 48:21828. */
export const ICON_SIZE = 25;

/** Four to a row, as the board lays them out (node 48:20136). */
export const COLUMNS = 4;

export const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const Column = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
`;

/**
 * Outlined rather than filled, unlike Discovery's vertical tiles: here the
 * tile holds nothing but a glyph, and a grey fill at 58pt with no label
 * inside it reads as a disabled control.
 */
export const Tile = styled.View`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
  ${continuousCorners}
`;
