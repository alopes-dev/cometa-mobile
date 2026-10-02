import { Text } from 'react-native';
import styled from 'styled-components/native';

/** `Category grid` — node 44:22533. */
export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-self: stretch;
  gap: ${({ theme }) => theme.onboarding.metrics.categoryGap}px;
`;

/**
 * One tile. Figma pins these at 148px inside a 312px row — exactly two columns.
 *
 * The two-column sizing lives on the pressable in `CategoryCard.tsx` (a flex
 * basis under half the row) rather than as a fixed width here: two tiles still
 * fill the row and the pair stays flush to both gutters at any screen width,
 * where a hard 148px would leave a ragged right edge on anything wider than the
 * 360px the board was drawn at. This box simply fills what it is given.
 */
export const Tile = styled.View<{ selected: boolean }>`
  width: 100%;
  height: ${({ theme }) => theme.onboarding.metrics.categoryHeight}px;
  justify-content: space-between;
  padding: ${({ theme }) => theme.onboarding.metrics.categoryPadding}px;
  border-radius: ${({ theme }) => theme.onboarding.metrics.categoryRadius}px;
  border-curve: continuous;
  border-width: 1px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.onboarding.color.brandPrimaryLight : theme.onboarding.color.surfaceSubtle};
  border-color: ${({ theme, selected }) =>
    selected ? theme.onboarding.color.brandPrimarySoft : theme.onboarding.color.borderSubtle};
`;

export const Label = styled(Text)<{ selected: boolean }>`
  font-family: ${({ theme }) => theme.onboarding.type.categoryLabel.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.categoryLabel.fontSize}px;
  color: ${({ theme, selected }) =>
    selected ? theme.onboarding.color.offerGreen : theme.onboarding.color.textPrimary};
`;
