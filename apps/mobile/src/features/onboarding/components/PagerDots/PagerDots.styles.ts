import styled from 'styled-components/native';

export const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.onboarding.metrics.pagerDotGap}px;
`;

/**
 * The active dot is a 28px capsule and the idle ones are 8px circles — node
 * 45:63. Width is the only thing that changes, so the active state reads as the
 * same dot stretched rather than as a different shape.
 */
export const Dot = styled.View<{ active: boolean }>`
  width: ${({ theme, active }) =>
    active
      ? theme.onboarding.metrics.pagerDotActiveWidth
      : theme.onboarding.metrics.pagerDotSize}px;
  height: ${({ theme }) => theme.onboarding.metrics.pagerDotSize}px;
  border-radius: 100px;
  background-color: ${({ theme, active }) =>
    active ? theme.onboarding.color.offerGreen : theme.onboarding.color.borderSubtle};
`;
