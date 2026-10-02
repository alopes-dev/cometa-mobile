import { useState } from 'react';
import { type TextInputProps } from 'react-native';
import { Text } from '../Text';
import { Icon, type IconProps } from '../Icon';
import type { Theme } from '@/components/design-system/ThemeProvider';
import { Container, FieldRow, Input } from './TextField.styles';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  shape?: 'default' | 'pill';
  /** Row height. Defaults to the 44pt minimum target. */
  height?: number;
  leadingIcon?: { name: IconProps['name']; sf?: IconProps['sf'] };
  backgroundColor?: keyof Theme['colors']['surface'];
};

export function TextField({
  label,
  error,
  helperText,
  disabled,
  editable,
  shape = 'default',
  height = 44,
  leadingIcon,
  backgroundColor,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Container>
      {label ? (
        <Text variant="caption" color="secondary">
          {label}
        </Text>
      ) : null}
      <FieldRow
        focused={focused}
        hasError={!!error}
        disabled={!!disabled}
        shape={shape}
        height={height}
        backgroundColor={backgroundColor}
      >
        {leadingIcon ? (
          <Icon name={leadingIcon.name} sf={leadingIcon.sf} size={18} color="secondary" />
        ) : null}
        <Input
          {...rest}
          editable={editable ?? !disabled}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
        />
      </FieldRow>
      {error ? (
        <Text variant="micro" color="error">
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="micro" color="secondary">
          {helperText}
        </Text>
      ) : null}
    </Container>
  );
}
