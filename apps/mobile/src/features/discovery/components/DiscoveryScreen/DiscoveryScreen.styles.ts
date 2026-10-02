import styled from 'styled-components/native';

/**
 * Discovery sits on the same 20pt margin Home does (node 48:20260), so the
 * two tabs line up when you switch between them, and the Trending carousel
 * bleeds past it the same way.
 */
export const GUTTER = 20;

/** Gap between a section's header and its content (node 48:20265). */
export const SECTION_GAP = 12;

/** Gap between cards in the Trending carousel (node 48:20290). */
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
