import { Text as RNText } from "react-native";
import styled from "styled-components/native";
import type { Theme } from "@/components/design-system/ThemeProvider";

export type TypographyVariant = keyof Theme["typography"];
export type ColorKey = keyof Theme["colors"];

export const StyledText = styled(RNText)<{
  variant: TypographyVariant;
  color: ColorKey;
}>`
  font-family: ${({ theme, variant }) => theme.typography[variant].fontFamily};
  font-size: ${({ theme, variant }) => theme.typography[variant].fontSize}px;
  line-height: ${({ theme, variant }) =>
    theme.typography[variant].lineHeight}px;
  color: ${({ theme, color }) => theme.colors[color]};
  ${({ theme, variant }) => {
    const { letterSpacing } = theme.typography[variant] as {
      letterSpacing?: number;
    };
    return letterSpacing !== undefined
      ? `letter-spacing: ${letterSpacing}px;`
      : "";
  }}
`;
