import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.onboarding.color.surfaceBackground};
`;

/** `Screen content` — node 44:22390 and its copies. */
export const Content = styled.View`
  flex: 1;
  align-items: flex-start;
  gap: ${({ theme }) => theme.onboarding.metrics.stepGap}px;
  padding-top: ${({ theme }) => theme.onboarding.metrics.stepPaddingTop}px;
  padding-bottom: ${({ theme }) => theme.onboarding.metrics.stepPaddingBottom}px;
  padding-horizontal: ${({ theme }) => theme.onboarding.metrics.screenPadding}px;
`;

/**
 * The `Flexible space` frames the boards use to push content apart. Drawn with
 * fixed heights in Figma because a static frame cannot flex; they are the
 * reason the symbol sits centred between the header and the actions, so they
 * become real flex spacers here.
 */
export const Spacer = styled.View`
  flex: 1;
  width: 100%;
`;

/** `Actions` — node 44:22404 and its copies. */
export const ActionStack = styled.View`
  align-items: stretch;
  align-self: stretch;
  gap: ${({ theme }) => theme.onboarding.metrics.actionGap}px;
`;
