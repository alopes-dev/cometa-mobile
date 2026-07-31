import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import styled from 'styled-components/native';
import type { Theme } from '@/design-system/ThemeProvider';

type TypographyVariant = keyof Theme['typography'];
type ColorKey = keyof Theme['colors'];

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorKey;
};

const StyledText = styled(RNText)<{ variant: TypographyVariant; color: ColorKey }>`
  font-family: ${({ theme, variant }) => theme.typography[variant].fontFamily};
  font-size: ${({ theme, variant }) => theme.typography[variant].fontSize}px;
  line-height: ${({ theme, variant }) => theme.typography[variant].lineHeight}px;
  color: ${({ theme, color }) => theme.colors[color]};
  ${({ theme, variant }) => {
    const { letterSpacing } = theme.typography[variant] as { letterSpacing?: number };
    return letterSpacing !== undefined ? `letter-spacing: ${letterSpacing}px;` : '';
  }}
`;

export function Text({ variant = 'body', color = 'textPrimary', ...rest }: TextProps) {
  return <StyledText variant={variant} color={color} {...rest} />;
}
