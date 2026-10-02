import { Text } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

/** Node 45:40. The photograph covers the frame, so the base colour only shows
 * for the instant before it decodes — black rather than white, so that instant
 * is not a flash. */
export const Root = styled.View`
  flex: 1;
  background-color: #000000;
`;

export const Photo = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/** `Photo gradient` — node 45:42. */
export const Scrim = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/** `Welcome hero` — node 45:48: bottom-aligned copy over the photograph. */
export const Hero = styled(SafeAreaView)`
  flex: 1;
  justify-content: flex-end;
  align-items: stretch;
  gap: ${({ theme }) => theme.onboarding.metrics.welcomeGap}px;
  padding-bottom: ${({ theme }) => theme.onboarding.metrics.welcomePaddingBottom}px;
  padding-horizontal: ${({ theme }) => theme.onboarding.metrics.screenPadding}px;
`;

export const Title = styled(Text)`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.onboarding.type.welcomeTitle.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.welcomeTitle.fontSize}px;
  line-height: ${({ theme }) => theme.onboarding.type.welcomeTitle.lineHeight}px;
  color: ${({ theme }) => theme.onboarding.color.surfaceBackground};
`;

export const Description = styled(Text)`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.onboarding.type.welcomeBody.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.welcomeBody.fontSize}px;
  line-height: ${({ theme }) => theme.onboarding.type.welcomeBody.lineHeight}px;
  color: ${({ theme }) => theme.onboarding.color.surfaceBackground};
`;
