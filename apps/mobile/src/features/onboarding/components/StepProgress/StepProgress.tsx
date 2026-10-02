import { SETUP_STEP_COUNT } from '../../content';
import { Track, Segment } from './StepProgress.styles';

export type StepProgressProps = {
  /** 1-based index of the step being shown. */
  current: number;
  total?: number;
};

/**
 * The four-segment progress bar at the top of each board-10 step — node
 * 44:22391 and its copies.
 *
 * Exposed to assistive tech as a progress bar rather than as four anonymous
 * views: the segments are the only thing telling a user how much of the setup
 * is left, so that information has to survive not being able to see them.
 */
export function StepProgress({ current, total = SETUP_STEP_COUNT }: StepProgressProps) {
  return (
    <Track
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current }}
      accessibilityLabel={`Passo ${current} de ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <Segment key={index} filled={index < current} />
      ))}
    </Track>
  );
}
