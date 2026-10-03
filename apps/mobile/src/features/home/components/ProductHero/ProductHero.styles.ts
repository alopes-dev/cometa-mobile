import { Image } from 'expo-image';
import styled from 'styled-components/native';

export const Wrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

/**
 * `Imagem` — node 48:20701.
 *
 * The board mocks an opaque status bar above the photograph (frame 48:20694),
 * but the app hides the status bar outright (`<StatusBar hidden />` in the
 * root layout), so reproducing that band would leave a dead white strip. The
 * photograph runs to the top edge instead, the way the restaurant hero does,
 * and the inset is added to its height so the 310px the board composes below
 * the bar is still the 310px that sits below the notch.
 */
export const HeroImage = styled(Image)<{ topInset: number }>`
  width: 100%;
  height: ${({ theme, topInset }) => theme.product.metrics.heroHeight + topInset}px;
`;

/** `Ações` — node 48:20702, inset 18 from both edges and 12 below the bar. */
export const Actions = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => topInset + theme.product.metrics.actionsTop}px;
  left: ${({ theme }) => theme.product.metrics.actionsInset}px;
  right: ${({ theme }) => theme.product.metrics.actionsInset}px;
  height: ${({ theme }) => theme.product.metrics.actionSize}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/**
 * Casts the button's lift — `0 3px 12px rgba(9,16,29,0.07)` on nodes 48:20703
 * and 48:20705. Separate from the button itself because the favourite control
 * is the shared atom, which draws its own circle; this wrapper gives both the
 * same lift without reaching inside either.
 */
export const ActionShadow = styled.View`
  width: ${({ theme }) => theme.product.metrics.actionSize}px;
  height: ${({ theme }) => theme.product.metrics.actionSize}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px ${({ theme }) => theme.product.actionShadow.offsetY}px;
  shadow-opacity: ${({ theme }) => theme.product.actionShadow.opacity};
  shadow-radius: ${({ theme }) => theme.product.actionShadow.radius}px;
  elevation: ${({ theme }) => theme.product.actionShadow.elevation};
`;

/** `Voltar` — node 48:20703. Opaque with a hairline, so it reads over any photograph. */
export const ActionButton = styled.View`
  width: ${({ theme }) => theme.product.metrics.actionSize}px;
  height: ${({ theme }) => theme.product.metrics.actionSize}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;
