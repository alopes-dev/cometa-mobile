import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Body, BottomAction, MainContent, Screen } from './AuthScreen.styles';

export type AuthScreenProps = {
  /** The blocks above the slack — navigation, header, inputs. */
  children: ReactNode;
  /** The action stack pinned to the bottom edge. */
  footer?: ReactNode;
};

/**
 * The shared frame every authentication screen is built on — node 74:24614
 * and its siblings: the white safe area, the 24px gutter, and the
 * content-over-actions split.
 *
 * The bottom edge is part of the safe area so the action stack clears the home
 * indicator; the board's 12px bottom padding sits inside that.
 *
 * Every screen here has a text field or is one tap from one, so keyboard
 * avoidance belongs to the frame rather than to each screen. `padding` is the
 * iOS behaviour that preserves the `space-between` split — `height` would
 * collapse the slack and drag the title up with the CTA.
 */
export function AuthScreen({ children, footer }: AuthScreenProps) {
  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Body>
          <MainContent>{children}</MainContent>
          {footer ? <BottomAction>{footer}</BottomAction> : null}
        </Body>
      </KeyboardAvoidingView>
    </Screen>
  );
}
