import { Text } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.onboarding.color.surfaceBackground};
`;

/**
 * `Onboarding content` — node 45:59.
 *
 * Top-aligned with no flex spacer, exactly as drawn: the board stacks the
 * illustration, copy, pagination and button from the top and leaves the
 * remainder of the screen empty below the button.
 */
export const Content = styled.View`
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.onboarding.metrics.slideGap}px;
  padding-top: ${({ theme }) => theme.onboarding.metrics.slidePaddingTop}px;
  padding-bottom: ${({ theme }) => theme.onboarding.metrics.slidePaddingBottom}px;
  padding-horizontal: ${({ theme }) => theme.onboarding.metrics.screenPadding}px;
`;

export const Illustration = styled(Image)`
  width: 100%;
  height: ${({ theme }) => theme.onboarding.metrics.illustrationHeight}px;
  border-radius: ${({ theme }) => theme.onboarding.metrics.illustrationRadius}px;
  border-curve: continuous;
`;

export const Title = styled(Text)`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.onboarding.type.slideTitle.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.slideTitle.fontSize}px;
  color: ${({ theme }) => theme.onboarding.color.offerGreen};
`;

export const Description = styled(Text)`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.onboarding.type.slideBody.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.slideBody.fontSize}px;
  line-height: ${({ theme }) => theme.onboarding.type.slideBody.lineHeight}px;
  color: ${({ theme }) => theme.onboarding.color.textSecondary};
`;

/** Stretches the button to the gutter, which Figma draws as `w-full`. */
export const ActionSlot = styled.View`
  align-self: stretch;
`;
