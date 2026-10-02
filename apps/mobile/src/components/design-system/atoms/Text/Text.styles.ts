import { Text as RNText } from "react-native";
import styled from "styled-components/native";
import type { Theme } from "@/components/design-system/ThemeProvider";

export type TypographyVariant = keyof Theme["typography"];
/** A foreground role, not a token path — see `theme/roles.ts`. */
export type ColorKey = keyof Theme["fg"];

export const StyledText = styled(RNText)<{
  variant: TypographyVariant;
  color: ColorKey;
}>`
  font-family: ${({ theme, variant }) => theme.typography[variant].fontFamily};
  font-size: ${({ theme, variant }) => theme.typography[variant].fontSize}px;
  line-height: ${({ theme, variant }) =>
    theme.typography[variant].lineHeight}px;
  letter-spacing: ${({ theme, variant }) =>
    theme.typography[variant].letterSpacing}px;
  color: ${({ theme, color }) => theme.fg[color]};
`;
