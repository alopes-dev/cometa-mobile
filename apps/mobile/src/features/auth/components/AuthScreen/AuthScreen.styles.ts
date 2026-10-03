import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.auth.color.surfaceBackground};
`;

/**
 * `Screen body` — node 74:24621.
 *
 * The board draws the main content at the top and the actions at the bottom
 * with the slack between them; `space-between` is that, and it is what keeps
 * the CTA on the home indicator on a tall screen and directly under the
 * content on a short one.
 */
export const Body = styled.View`
  flex: 1;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.auth.metrics.screenPaddingTop}px;
  padding-bottom: ${({ theme }) => theme.auth.metrics.screenPaddingBottom}px;
  padding-horizontal: ${({ theme }) => theme.auth.metrics.screenPadding}px;
`;

/** `Main content` — node 74:24622. */
export const MainContent = styled.View`
  align-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.auth.metrics.contentGap}px;
`;

/** `Bottom action` — node 74:24641. */
export const BottomAction = styled.View`
  align-self: stretch;
  align-items: stretch;
  gap: ${({ theme }) => theme.auth.metrics.actionGap}px;
`;
