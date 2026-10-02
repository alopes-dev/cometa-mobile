import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Block, Label, Box } from './AddressField.styles';

export { Row, RowItem } from './AddressField.styles';

export type AddressFieldProps = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'keyboardType' | 'autoCapitalize' | 'returnKeyType' | 'onSubmitEditing'
> & {
  label: string;
  placeholder: string;
};

/**
 * One labelled text field of the address form — node 44:22455.
 *
 * `placeholderTextColor` is the design's `text/muted`; typed text is
 * `text/primary`. That difference is what separates the drawn placeholder rows
 * from the "Cidade" row, which Figma shows holding a real value.
 */
export function AddressField({ label, placeholder, ...input }: AddressFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <Block>
      <Label>{label}</Label>
      <Box
        {...input}
        focused={focused}
        placeholder={placeholder}
        placeholderTextColor={theme.onboarding.color.textMuted}
        accessibilityLabel={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Block>
  );
}
