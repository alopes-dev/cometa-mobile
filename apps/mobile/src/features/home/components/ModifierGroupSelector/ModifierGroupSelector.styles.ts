import styled from 'styled-components/native';
import { product, productTextStyle, radius } from '@/theme';

/** `Personalizar` — node 48:20712 sets a flat 12px rhythm throughout. */
export const Container = styled.View`
  gap: ${({ theme }) => theme.product.metrics.customizeGap}px;
`;

/**
 * The group's own name.
 *
 * The board draws a single section heading over a flat list of options
 * (node 48:20713, rendered by the screen) because the item it mocks has one
 * group. Real items carry several — a required bread, a required cheese, then
 * optional extras — so each group still names itself, but quietly: a 13px
 * secondary label that sits under the section voice rather than competing
 * with it.
 */
export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/** `Opção` — nodes 48:20714, 48:20717, 48:20720. */
export const OptionRow = styled.View`
  height: ${({ theme }) => theme.product.metrics.optionHeight}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[12]}px;
`;

/** `Nome` — nodes 48:20715, 48:20718, 48:20721. */
export const OptionLabel = styled.Text`
  flex: 1;
  ${productTextStyle('optionLabel')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Static shape only — background/border are animated per-option (see
// ModifierOptionRow), so they aren't part of these style objects.
const base = {
  width: product.metrics.optionBoxSize,
  height: product.metrics.optionBoxSize,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

/**
 * One-of-many keeps a circle even though the board draws every `Seleção`
 * (nodes 48:20716, 48:20719, 48:20722) as a rounded square: the three options
 * it mocks are all optional extras, so it never had a required single-choice
 * group to draw. Giving both the same shape would make "pick one" and "pick
 * any" look identical.
 */
export const circleShape = { ...base, borderRadius: radius.full };

/** `Seleção` — 20px at a 6px radius. */
export const squareShape = { ...base, borderRadius: product.metrics.optionBoxRadius };
