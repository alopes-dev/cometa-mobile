import styled from 'styled-components/native';

export const withAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

export const Container = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding-horizontal: 12px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme, selected }) =>
    selected ? withAlpha(theme.colors.primary, '1A') : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
`;
