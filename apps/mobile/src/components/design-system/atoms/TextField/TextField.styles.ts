import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import type { Theme } from '@/components/design-system/ThemeProvider';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const FieldRow = styled.View<{
  focused: boolean;
  hasError: boolean;
  disabled: boolean;
  shape: 'default' | 'pill';
  backgroundColor?: keyof Theme['colors']['surface'];
}>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
  height: 44px;
  border-radius: ${({ theme, shape }) => (shape === 'pill' ? theme.radius.full : theme.radius.md)}px;
  padding-horizontal: ${({ theme }) => theme.spacing[16]}px;
  background-color: ${({ theme, backgroundColor }) => theme.colors.surface[backgroundColor ?? 'secondary']};
  border-width: 1px;
  border-color: ${({ theme, focused, hasError }) =>
    hasError ? theme.colors.border.error : focused ? theme.colors.border.focus : theme.colors.border.default};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export const Input = styled(TextInput)`
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.bodyLarge.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyLarge.fontSize}px;
`;
