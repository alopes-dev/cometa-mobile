import styled from 'styled-components/native';

export const withAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

export const Container = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding-horizontal: 14px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.background : theme.colors.brandChipBackground};
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.brandAccent : 'transparent')};
`;
