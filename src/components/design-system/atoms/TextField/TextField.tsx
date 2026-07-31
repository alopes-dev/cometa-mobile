import { useState } from 'react';
import { type TextInputProps } from 'react-native';
import { Text } from '../Text';
import { Container, Field } from './TextField.styles';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
};

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
