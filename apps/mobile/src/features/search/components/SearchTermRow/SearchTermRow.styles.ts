import styled from 'styled-components/native';

/** Node 48:20099. Already clears the 44pt target, so the row needs no slop. */
export const ROW_HEIGHT = 46;

export const ICON_SIZE = 17;

/** The x that forgets a term, node 48:21792. */
export const REMOVE_ICON_SIZE = 15;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[12]}px;
  height: ${ROW_HEIGHT}px;
`;

export const Term = styled.View`
  flex: 1;
`;
