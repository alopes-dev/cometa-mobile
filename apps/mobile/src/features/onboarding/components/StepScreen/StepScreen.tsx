import type { ReactNode } from 'react';
import { StepProgress } from '../StepProgress';
import { Screen, Content } from './StepScreen.styles';

export { Spacer, ActionStack } from './StepScreen.styles';

export type StepScreenProps = {
  /**
   * 1-based step, which fills that many progress segments. Omitted on the
   * pre-permission screen (node 44:22414), which the design draws without a
   * progress bar because it is context for the system dialog, not a step.
   */
  step?: number;
  children: ReactNode;
};

/**
 * The shared frame every board-10 screen is built on — the white safe area,
 * the 24px gutter and the 20px rhythm between blocks.
 *
 * The bottom edge is included in the safe area so the action stack clears the
 * home indicator; the design's 28px bottom padding sits inside that.
 */
export function StepScreen({ step, children }: StepScreenProps) {
  return (
    <Screen edges={['top', 'bottom']}>
      <Content>
        {step === undefined ? null : <StepProgress current={step} />}
        {children}
      </Content>
    </Screen>
  );
}
