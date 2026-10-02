import styled from 'styled-components/native';

export const Track = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.onboarding.metrics.progressGap}px;
  width: 100%;
`;

/**
 * One segment. Figma draws four fixed 73.5px bars inside a 312px row; they are
 * flexed here instead so the track fills whatever width the device gives it,
 * which is the same proportion at every size.
 */
export const Segment = styled.View<{ filled: boolean }>`
  flex: 1;
  height: ${({ theme }) => theme.onboarding.metrics.progressHeight}px;
  border-radius: 999px;
  background-color: ${({ theme, filled }) =>
    filled ? theme.onboarding.color.offerGreen : theme.onboarding.color.borderSubtle};
`;
