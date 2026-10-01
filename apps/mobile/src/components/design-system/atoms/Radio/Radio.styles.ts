import styled from 'styled-components/native';

export const Outer = styled.View<{ selected: boolean; disabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export const Inner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
`;
