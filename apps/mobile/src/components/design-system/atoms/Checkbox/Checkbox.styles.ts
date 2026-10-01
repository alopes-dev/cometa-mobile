import styled from 'styled-components/native';

export const Box = styled.View<{ checked: boolean; disabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, checked }) => (checked ? theme.colors.primary : 'transparent')};
  border-width: 1px;
  border-color: ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.border)};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;
