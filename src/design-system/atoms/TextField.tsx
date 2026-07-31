import { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
};

const Container = styled.View`
  gap: 4px;
`;

const Field = styled(TextInput)<{ focused: boolean; hasError: boolean; disabled: boolean }>`
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

export function TextField({ label, error, helperText, disabled, editable, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Container>
      {label ? (
        <Text variant="footnote" color="textSecondary">
          {label}
        </Text>
      ) : null}
      <Field
        {...rest}
        editable={editable ?? !disabled}
        focused={focused}
        hasError={!!error}
        disabled={!!disabled}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
      />
      {error ? (
        <Text variant="caption" color="error">
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="textSecondary">
          {helperText}
        </Text>
      ) : null}
    </Container>
  );
}
