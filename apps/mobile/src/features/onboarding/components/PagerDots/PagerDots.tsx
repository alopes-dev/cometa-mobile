import { Row, Dot } from './PagerDots.styles';

export type PagerDotsProps = {
  /** 0-based index of the visible slide. */
  index: number;
  count: number;
};

/**
 * Pagination for the three value slides — node 45:63 and its copies.
 *
 * Marked `none` for assistive tech: the slide's own heading already announces
 * which step it is, and reading three unlabelled dots after it adds nothing.
 */
export function PagerDots({ index, count }: PagerDotsProps) {
  return (
    <Row accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} active={i === index} />
      ))}
    </Row>
  );
}
