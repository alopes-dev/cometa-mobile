import styled from 'styled-components/native';
import { productTextStyle, textStyle } from '@/theme';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
  background-color: ${({ theme }) => theme.colors.brand.subtle};
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding: ${({ theme }) => theme.spacing[4]}px;
`;

export const StepButton = styled.View<{ variant: 'decrement' | 'increment' }>`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant }) =>
    variant === 'increment' ? theme.colors.brand.base : theme.colors.surface.primary};
`;

export const Value = styled.Text`
  min-width: 20px;
  text-align: center;
  ${textStyle('bodyStrong')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

/**
 * `Quantidade` — node 48:20724 of the product board.
 *
 * A wider, flatter control than the pill above: it sits beside the add-to-cart
 * button and has to match its 54px height and 16px radius, which is why this
 * is a variant rather than a second component.
 */
export const PanelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.product.metrics.stepperGap}px;
  height: ${({ theme }) => theme.product.metrics.controlHeight}px;
  padding-horizontal: ${({ theme }) => theme.product.metrics.stepperPaddingHorizontal}px;
  border-radius: ${({ theme }) => theme.product.metrics.controlRadius}px;
  border-curve: continuous;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

/**
 * `Menos` / `Mais` — nodes 48:20725, 48:20727. Glyphs rather than icons,
 * because that is what the board draws: a 22px minus and plus set in the text
 * face, the plus carrying the accent so the additive action is the one that
 * reads first.
 */
export const PanelSign = styled.Text<{ accent?: boolean }>`
  ${productTextStyle('stepperSign')}
  color: ${({ theme, accent }) => (accent ? theme.colors.brand.base : theme.colors.text.primary)};
`;

/** `Valor` — node 48:20726. */
export const PanelValue = styled.Text`
  min-width: 12px;
  text-align: center;
  ${productTextStyle('stepperValue')}
  color: ${({ theme }) => theme.colors.text.primary};
`;
