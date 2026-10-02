import styled from 'styled-components/native';

/** `Location symbol` — node 44:22400. */
export const Panel = styled.View`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => theme.onboarding.metrics.symbolPanelHeight}px;
  border-radius: ${({ theme }) => theme.onboarding.metrics.symbolPanelRadius}px;
  border-curve: continuous;
  background-color: ${({ theme }) => theme.onboarding.color.surfaceSubtle};
`;

/** `Pin field` — node 44:22401. */
export const PinField = styled.View`
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.onboarding.metrics.symbolFieldSize}px;
  height: ${({ theme }) => theme.onboarding.metrics.symbolFieldSize}px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.onboarding.color.brandPrimaryLight};
`;
