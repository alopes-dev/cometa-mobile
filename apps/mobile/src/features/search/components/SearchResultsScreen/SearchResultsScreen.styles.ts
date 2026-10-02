import styled from 'styled-components/native';

/** The same 20pt margin the rest of the app sits on (node 48:20172). */
export const GUTTER = 20;

/** Gap between the bands of the results screen (node 48:20171). */
export const CONTENT_GAP = 20;

/** Gap between the count and the cards, and between the cards (node 48:20193). */
export const RESULTS_GAP = 14;

/** The field that holds the query (node 48:20173). */
export const FIELD_HEIGHT = 52;

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const Gutter = styled.View`
  padding-horizontal: ${GUTTER}px;
`;

export const Results = styled.View`
  gap: ${RESULTS_GAP}px;
`;

/**
 * The board draws no empty state, because every query it shows has results.
 * One that does not needs somewhere to say so — centred in the space the
 * cards would have filled, and nothing more than the two lines it takes.
 */
export const Empty = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
  padding-vertical: ${({ theme }) => theme.spacing[48]}px;
`;
