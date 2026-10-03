import styled from 'styled-components/native';
import { boardTextStyle } from '@/theme';

/**
 * `Categorias sticky` — node 48:20632. One hairline under the whole row
 * rather than a moving indicator: the board distinguishes the selected
 * category by weight and colour, not by a pill.
 */
export const Underline = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border.subtle};
`;

/** The board hangs the labels from the top of the row and pads below them. */
export const TabHit = styled.View`
  padding-bottom: ${({ theme }) => theme.business.metrics.categoriesPaddingBottom}px;
`;

/**
 * Selected state is carried by two channels — the brand colour and the
 * heavier face — so colour alone never signals it (§44).
 */
export const TabLabel = styled.Text<{ selected: boolean }>`
  ${({ selected }) => boardTextStyle(selected ? 'categoryActive' : 'category')}
  color: ${({ theme, selected }) => (selected ? theme.colors.text.brand : theme.colors.text.secondary)};
`;
