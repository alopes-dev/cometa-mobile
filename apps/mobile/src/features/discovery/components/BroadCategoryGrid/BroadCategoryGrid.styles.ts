import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';

/** Three tiles to a row, as the board lays them out (node 48:20267). */
export const COLUMNS = 3;

/** Gap between tiles, both ways (node 48:20267). */
export const TILE_GAP = 12;

/** Node 48:20268. */
export const TILE_HEIGHT = 76;

export const ICON_SIZE = 22;

export const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${TILE_GAP}px;
`;

/**
 * The tile the board fills but does not outline (node 48:20268). It reads as
 * a surface against the page rather than as a button, which is right: these
 * are doorways into a vertical, not controls that hold a state.
 */
export const Tile = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  height: ${TILE_HEIGHT}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
  padding: ${({ theme }) => theme.spacing[12]}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  ${continuousCorners}
`;

export const Label = styled.View`
  flex: 1;
`;
