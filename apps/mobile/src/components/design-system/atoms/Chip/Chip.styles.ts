import styled from 'styled-components/native';

export type ChipSize = 'md' | 'sm';
export type ChipVariant = 'filled' | 'outlined';

const HEIGHT: Record<ChipSize, number> = {
  /** Home's filter bar (node 48:19877). */
  md: 40,
  /** Search's scope tabs and quick filters (nodes 48:20177, 48:20186). */
  sm: 34,
};

export const Container = styled.View<{
  selected: boolean;
  size: ChipSize;
  variant: ChipVariant;
}>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]}px;
  height: ${({ size }) => HEIGHT[size]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[12]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, selected, variant }) =>
    selected
      ? theme.colors.surface.selected
      : variant === 'outlined'
        ? theme.colors.surface.primary
        : theme.colors.surface.secondary};
  border-width: 1px;
  border-color: ${({ theme, selected, variant }) =>
    selected
      ? theme.colors.border.selected
      : variant === 'outlined'
        ? theme.colors.border.subtle
        : 'transparent'};
`;
