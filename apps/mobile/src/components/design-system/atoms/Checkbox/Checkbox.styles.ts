import styled from 'styled-components/native';

export const Box = styled.View<{ checked: boolean; disabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.xs}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, checked }) => (checked ? theme.colors.brand.base : 'transparent')};
  border-width: 1px;
  border-color: ${({ theme, checked }) => (checked ? theme.colors.border.selected : theme.colors.border.default)};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;
