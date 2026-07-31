import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const Container = styled.View`
  gap: 4px;
`;

export const Field = styled(TextInput)<{ focused: boolean; hasError: boolean; disabled: boolean }>`
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, focused, hasError }) =>
    hasError ? theme.colors.error : focused ? theme.colors.primary : theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;
