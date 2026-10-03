import { Text } from 'react-native';
import styled from 'styled-components/native';

/** `Navigation` — node 74:24712. Reserves its height even with no back target. */
export const Navigation = styled.View`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  height: ${({ theme }) => theme.auth.metrics.navHeight}px;
`;

/** `Back button` — node 74:24713. */
export const BackTarget = styled.View`
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.auth.metrics.backSize}px;
  height: ${({ theme }) => theme.auth.metrics.backSize}px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.auth.color.surfaceSubtle};
`;

/** `Header` — node 74:24715. */
export const Block = styled.View`
  align-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.auth.metrics.headerGap}px;
`;

export const Title = styled(Text)`
  width: 100%;
  font-family: ${({ theme }) => theme.auth.type.title.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.title.fontSize}px;
  line-height: ${({ theme }) => theme.auth.type.title.lineHeight}px;
  color: ${({ theme }) => theme.auth.color.textPrimary};
`;

export const Description = styled(Text)`
  width: 100%;
  font-family: ${({ theme }) => theme.auth.type.body.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.body.fontSize}px;
  line-height: ${({ theme }) => theme.auth.type.body.lineHeight}px;
  color: ${({ theme }) => theme.auth.color.textSecondary};
`;
