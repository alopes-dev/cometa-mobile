import { type TextProps as RNTextProps } from 'react-native';
import { StyledText, type TypographyVariant, type ColorKey } from './Text.styles';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorKey;
};

export function Text({ variant = 'body', color = 'textPrimary', ...rest }: TextProps) {
  return <StyledText variant={variant} color={color} {...rest} />;
}
