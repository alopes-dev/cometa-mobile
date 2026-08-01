import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const Container = styled.View`
  gap: 4px;
`;

export const FieldRow = styled.View<{
  focused: boolean;
  hasError: boolean;
  disabled: boolean;
  shape: 'default' | 'pill';
}>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  height: 44px;
  border-radius: ${({ theme, shape }) => (shape === 'pill' ? theme.radius.pill : theme.radius.md)}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, focused, hasError }) =>
    hasError ? theme.colors.error : focused ? theme.colors.primary : theme.colors.border};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export const Input = styled(TextInput)`
  flex: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;
