import styled from "styled-components/native";
import type { Theme } from "@/components/design-system/ThemeProvider";
import { spacing } from '@/theme';

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

type Colors = Theme["colors"];
/** A foreground role, so the label can be handed straight to `Text`/`Icon`. */
type LabelRole = keyof Theme["fg"];

/**
 * Per-variant appearance, resolved from semantic tokens at render time.
 *
 * `label` is deliberately a role rather than a literal color: `onBrand`
 * resolves to white on a light-mode brand fill and to near-black on the
 * lighter dark-mode fill, so a filled button stays legible in both schemes
 * without a second variant table.
 *
 * Only `primary`, `success` and `danger` are filled. §20: secondary is
 * neutral and tertiary is text — the point is that not every button is green.
 */
export const VARIANT_STYLE: Record<
  ButtonVariant,
  {
    background: (c: Colors) => string;
    border: (c: Colors) => string;
    label: LabelRole;
  }
> = {
  primary: {
    background: (c) => c.brand.base,
    border: () => "transparent",
    label: "onBrand",
  },
  secondary: {
    background: (c) => c.surface.secondary,
    border: () => "transparent",
    label: "primary",
  },
  success: {
    background: (c) => c.status.success.fill,
    border: () => "transparent",
    label: "onBrand",
  },
  danger: {
    background: (c) => c.status.error.fill,
    border: () => "transparent",
    label: "onBrand",
  },
  outline: {
    background: () => "transparent",
    border: (c) => c.border.selected,
    label: "brand",
  },
  ghost: {
    background: (c) => c.surface.secondary,
    border: () => "transparent",
    label: "primary",
  },
  text: {
    background: () => "transparent",
    border: () => "transparent",
    label: "brand",
  },
};

export const SIZE_STYLE: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number }
> = {
  // Heights are control dimensions, not rhythm steps: 44 is the HIG minimum
  // tappable edge, with one step either side of it.
  sm: { height: 36, paddingHorizontal: spacing[12] },
  md: { height: 44, paddingHorizontal: spacing[16] },
  lg: { height: 52, paddingHorizontal: spacing[20] },
};

export const SIZE_TEXT_VARIANT: Record<ButtonSize, keyof Theme["typography"]> =
  {
    sm: "label",
    md: "title",
    lg: "title",
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
  gap: ${({ theme }) => theme.spacing[8]}px;
  height: ${({ size }) => SIZE_STYLE[size].height}px;
  min-width: ${({ shape, size }) =>
    shape === "circle" ? Math.max(SIZE_STYLE[size].height, 44) : 44}px;
  padding-horizontal: ${({ shape, size }) =>
    shape === "circle" ? 0 : SIZE_STYLE[size].paddingHorizontal}px;
  border-radius: ${({ shape, theme }) =>
    shape === "default" ? theme.radius.md : theme.radius.full}px;
  border-curve: continuous;
  background-color: ${({ theme, variant }) =>
    VARIANT_STYLE[variant].background(theme.colors)};
  border-width: ${({ theme, variant }) =>
    VARIANT_STYLE[variant].border(theme.colors) === "transparent" ? 0 : 1}px;
  border-color: ${({ theme, variant }) =>
    VARIANT_STYLE[variant].border(theme.colors)};
  opacity: ${({ theme, disabled }) =>
    disabled ? theme.opacity[40] : theme.opacity[100]};
`;
