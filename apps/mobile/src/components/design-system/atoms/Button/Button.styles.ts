import styled from "styled-components/native";
import type { Theme } from "@/components/design-system/ThemeProvider";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "text"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "default" | "pill" | "circle";

type ColorKey = keyof Theme["colors"];

export const VARIANT_STYLE: Record<
  ButtonVariant,
  {
    background: ColorKey | "transparent";
    label: ColorKey;
    border: ColorKey | "transparent";
  }
> = {
  primary: { background: "primary", label: "onPrimary", border: "transparent" },
  secondary: {
    background: "secondary",
    label: "onSecondary",
    border: "transparent",
  },
  success: { background: "success", label: "onPrimary", border: "transparent" },
  danger: { background: "error", label: "onPrimary", border: "transparent" },
  outline: { background: "transparent", label: "primary", border: "primary" },
  ghost: { background: "surface", label: "textPrimary", border: "transparent" },
  text: { background: "transparent", label: "primary", border: "transparent" },
};

export const SIZE_STYLE: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number }
> = {
  sm: { height: 36, paddingHorizontal: 12 },
  md: { height: 44, paddingHorizontal: 16 },
  lg: { height: 52, paddingHorizontal: 20 },
};

export const SIZE_TEXT_VARIANT: Record<ButtonSize, keyof Theme["typography"]> =
  {
    sm: "footnote",
    md: "bodyEmphasized",
    lg: "bodyEmphasized",
  };

const MIN_HIT_TARGET = 44;
export const SIZE_HIT_SLOP: Record<ButtonSize, number> = Object.fromEntries(
  Object.entries(SIZE_STYLE).map(([size, style]) => [
    size,
    Math.max(0, Math.ceil((MIN_HIT_TARGET - style.height) / 2)),
  ]),
) as Record<ButtonSize, number>;

export const Container = styled.View<{
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  disabled: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ size }) => SIZE_STYLE[size].height}px;
  min-width: ${({ shape, size }) =>
    shape === "circle" ? Math.max(SIZE_STYLE[size].height, 44) : 44}px;
  padding-horizontal: ${({ shape, size }) =>
    shape === "circle" ? 0 : SIZE_STYLE[size].paddingHorizontal}px;
  border-radius: ${({ shape, theme }) =>
    shape === "default" ? theme.radius.md : theme.radius.pill}px;
  background-color: ${({ theme, variant }) => {
    const bg = VARIANT_STYLE[variant].background;
    return bg === "transparent" ? "transparent" : theme.colors[bg];
  }};
  border-width: ${({ variant }) =>
    VARIANT_STYLE[variant].border === "transparent" ? 0 : 1}px;
  border-color: ${({ theme, variant }) => {
    const border = VARIANT_STYLE[variant].border;
    return border === "transparent" ? "transparent" : theme.colors[border];
  }};
  opacity: ${({ theme, disabled }) =>
    disabled ? theme.opacity[40] : theme.opacity[100]};
`;
