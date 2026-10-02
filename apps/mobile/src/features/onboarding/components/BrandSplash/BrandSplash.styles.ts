import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import styled from 'styled-components/native';

/** `Splash` — node 45:17. */
export const Root = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.onboarding.metrics.splashGap}px;
  background-color: ${({ theme }) => theme.onboarding.color.surfaceBackground};
`;

/** `Kometa logo` — node 45:24. */
export const LogoRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.onboarding.metrics.splashMarkGap}px;
`;

/** `Logo mark` — node 45:25. */
export const Mark = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.onboarding.metrics.splashMarkSize}px;
  height: ${({ theme }) => theme.onboarding.metrics.splashMarkSize}px;
`;

/** `Speed lines` — node 45:26. Drawn as rectangles in Figma, so drawn as views
 * here; only the plate and the food dot were exported as assets. */
export const SpeedLines = styled.View`
  width: 12px;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
`;

export const SpeedLine = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 2px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.onboarding.color.offerGreen};
`;

export const Plate = styled(Image)`
  width: 34.56px;
  height: 34.56px;
`;

/** `Food` — node 45:31, pinned inside the 48px mark exactly where Figma puts it. */
export const Food = styled(Image)`
  position: absolute;
  left: 22.56px;
  top: 13.44px;
  width: 10.56px;
  height: 10.56px;
`;

export const Wordmark = styled(Text)`
  font-family: ${({ theme }) => theme.onboarding.type.wordmark.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.wordmark.fontSize}px;
  color: ${({ theme }) => theme.onboarding.color.textPrimary};
`;

/** `Dots loader` — node 45:33. */
export const Loader = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.onboarding.metrics.splashDotGap}px;
`;

export const LoaderDot = styled.View<{ active: boolean }>`
  width: ${({ theme, active }) =>
    active
      ? theme.onboarding.metrics.splashDotActiveWidth
      : theme.onboarding.metrics.splashDotSize}px;
  height: ${({ theme }) => theme.onboarding.metrics.splashDotSize}px;
  border-radius: 100px;
  background-color: ${({ theme, active }) =>
    active ? theme.onboarding.color.offerGreen : theme.onboarding.color.splashDotIdle};
`;
