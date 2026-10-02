import styled from 'styled-components/native';

export const Container = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]}px;
  height: 40px;
  padding-horizontal: ${({ theme }) => theme.spacing[12]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.surface.selected : theme.colors.surface.secondary};
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.border.selected : 'transparent')};
`;
