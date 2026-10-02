import styled from 'styled-components/native';

/**
 * Home's gutter is 20, not the 16 of `layout.screenPadding` — the board sets
 * every section on a 20px margin (node 48:19779) and the carousels bleed past
 * it. Both are steps on the spacing scale, so this is a token, not a literal.
 */
export const GUTTER = 20;

/** Gap between a section's header and its content (node 48:19798). */
export const SECTION_GAP = 12;

/** Gap between cards in a carousel (node 48:19830). */
export const CAROUSEL_GAP = 12;

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const Gutter = styled.View`
  padding-horizontal: ${GUTTER}px;
`;

export const Section = styled.View`
  gap: ${SECTION_GAP}px;
`;
