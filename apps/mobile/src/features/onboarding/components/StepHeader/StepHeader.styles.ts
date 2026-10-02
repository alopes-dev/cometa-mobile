import { Text } from 'react-native';
import styled from 'styled-components/native';

/** `Screen header` — node 44:22396. */
export const Block = styled.View`
  align-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.onboarding.metrics.headerGap}px;
`;

export const Title = styled(Text)`
  width: 100%;
  font-family: ${({ theme }) => theme.onboarding.type.stepTitle.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.stepTitle.fontSize}px;
  line-height: ${({ theme }) => theme.onboarding.type.stepTitle.lineHeight}px;
  color: ${({ theme }) => theme.onboarding.color.textPrimary};
`;

export const Description = styled(Text)`
  width: 100%;
  font-family: ${({ theme }) => theme.onboarding.type.stepBody.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.stepBody.fontSize}px;
  line-height: ${({ theme }) => theme.onboarding.type.stepBody.lineHeight}px;
  color: ${({ theme }) => theme.onboarding.color.textSecondary};
`;

/** `Back action` — node 44:22450. */
export const BackTarget = styled.View`
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.onboarding.metrics.backActionSize}px;
  height: ${({ theme }) => theme.onboarding.metrics.backActionSize}px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.onboarding.color.surfaceSubtle};
`;
