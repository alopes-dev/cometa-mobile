import { Text } from 'react-native';
import styled from 'styled-components/native';

/** `Permission copy` / `Notification message` — nodes 44:22423, 44:22504. */
export const Block = styled.View`
  align-self: stretch;
  align-items: center;
  gap: 20px;
`;

/**
 * The round field behind the glyph — nodes 44:22424, 44:22505, 44:22401.
 * Also the only place `brand/primary-light` appears as a fill.
 */
export const SymbolField = styled.View`
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.onboarding.metrics.symbolFieldSize}px;
  height: ${({ theme }) => theme.onboarding.metrics.symbolFieldSize}px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.onboarding.color.brandPrimaryLight};
`;

export const Title = styled(Text)`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.onboarding.type.permissionTitle.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.permissionTitle.fontSize}px;
  color: ${({ theme }) => theme.onboarding.color.textPrimary};
`;

export const Description = styled(Text)`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.onboarding.type.permissionBody.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.permissionBody.fontSize}px;
  line-height: ${({ theme }) => theme.onboarding.type.permissionBody.lineHeight}px;
  color: ${({ theme }) => theme.onboarding.color.textSecondary};
`;
