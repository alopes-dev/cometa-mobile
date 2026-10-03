import { Image } from 'expo-image';
import styled from 'styled-components/native';

/**
 * The board draws an opaque status bar above the photograph rather than
 * letting the image run under it (frame 48:20694), so the safe area is a
 * padded white band and the image starts below it at its full 310px.
 */
export const Wrapper = styled.View<{ topInset: number }>`
  padding-top: ${({ topInset }) => topInset}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

/** `Imagem` — node 48:20701. */
export const HeroImage = styled(Image)`
  width: 100%;
  height: ${({ theme }) => theme.product.metrics.heroHeight}px;
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
