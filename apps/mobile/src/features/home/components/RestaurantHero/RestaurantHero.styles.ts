import styled from 'styled-components/native';

/** `Ações` — node 48:20605, pinned to the top of the hero. */
export const Actions = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ topInset }) => topInset}px;
  left: ${({ theme }) => theme.business.metrics.actionsInset}px;
  right: ${({ theme }) => theme.business.metrics.actionsInset}px;
  height: ${({ theme }) => theme.business.metrics.actionSize}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/** `Partilha e favorito` — node 48:20608. */
export const ActionGroup = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.business.metrics.actionGap}px;
`;

/**
 * Casts the button's shadow — `0 3px 12px rgba(9,16,29,0.07)` on the board.
 * Separate from the button itself because the favourite control is the shared
 * atom, which draws its own circle; this wrapper gives all three the same
 * lift without reaching inside any of them.
 */
export const ActionShadow = styled.View`
  width: ${({ theme }) => theme.business.metrics.actionSize}px;
  height: ${({ theme }) => theme.business.metrics.actionSize}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px ${({ theme }) => theme.business.actionShadow.offsetY}px;
  shadow-opacity: ${({ theme }) => theme.business.actionShadow.opacity};
  shadow-radius: ${({ theme }) => theme.business.actionShadow.radius}px;
  elevation: ${({ theme }) => theme.business.actionShadow.elevation};
`;

/**
 * `Voltar` / `Partilhar` — nodes 48:20606, 48:20609. Opaque white with a
 * hairline, so the same button reads over the photograph and over the solid
 * header it collapses into, with no cross-fade between two icon colours.
 */
export const ActionButton = styled.View`
  width: ${({ theme }) => theme.business.metrics.actionSize}px;
  height: ${({ theme }) => theme.business.metrics.actionSize}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

/**
 * The name, once the photograph has collapsed away. Inset past the buttons on
 * both sides so a long name truncates instead of running under them.
 */
export const CompactTitleWrapper = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ topInset }) => topInset}px;
  left: 66px;
  right: 116px;
  height: ${({ theme }) => theme.business.metrics.actionSize}px;
  align-items: center;
  justify-content: center;
`;
