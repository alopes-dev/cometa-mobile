import styled from 'styled-components/native';
import { productTextStyle } from '@/theme';

/** `Carrinho flutuante` — node 48:20772, pinned 14 from each edge. */
export const Positioner = styled.View<{ bottomInset: number }>`
  position: absolute;
  left: ${({ theme }) => theme.product.metrics.cartBarInset}px;
  right: ${({ theme }) => theme.product.metrics.cartBarInset}px;
  bottom: ${({ theme, bottomInset }) => bottomInset + theme.product.metrics.cartBarBottom}px;
`;

export const Container = styled.View`
  height: ${({ theme }) => theme.product.metrics.cartBarHeight}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.product.metrics.cartBarPaddingHorizontal}px;
  border-radius: ${({ theme }) => theme.product.metrics.cartBarRadius}px;
  border-curve: continuous;
  background-color: ${({ theme }) => theme.colors.background.primary};
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px ${({ theme }) => theme.product.cartBarShadow.offsetY}px;
  shadow-opacity: ${({ theme }) => theme.product.cartBarShadow.opacity};
  shadow-radius: ${({ theme }) => theme.product.cartBarShadow.radius}px;
  elevation: ${({ theme }) => theme.product.cartBarShadow.elevation};
`;

/** `Resumo` — node 48:20773. */
export const Summary = styled.Text`
  ${productTextStyle('cartBar')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

/** `Ação` — node 48:20774. */
export const Action = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]}px;
`;

export const ActionText = styled.Text`
  ${productTextStyle('cartBar')}
  color: ${({ theme }) => theme.colors.text.brand};
`;
