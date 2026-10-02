import styled from "styled-components/native";
import type { Theme } from "@/components/design-system/ThemeProvider";

export type BadgeVariant = "primary" | "error" | "success" | "neutral";
/** A fill role, not a token path — see `theme/roles.ts`. */
export type ColorKey = keyof Theme["fill"];

export const VARIANT_COLOR: Record<BadgeVariant, ColorKey> = {
  primary: "brand",
  error: "error",
  success: "success",
  neutral: "neutral",
};

export const NumberBadge = styled.View<{ color: ColorKey }>`
  min-width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing[6]}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, color }) => theme.fill[color]};
`;

export const DotBadge = styled.View<{ color: ColorKey }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, color }) => theme.fill[color]};
`;
