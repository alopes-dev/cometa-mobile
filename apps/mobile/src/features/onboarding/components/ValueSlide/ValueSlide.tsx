import type { ValueSlideContent } from '../../content';
import { OnboardingAction } from '../OnboardingAction';
import { PagerDots } from '../PagerDots';
import {
  Screen,
  Content,
  Illustration,
  Title,
  Description,
  ActionSlot,
} from './ValueSlide.styles';

export type ValueSlideProps = {
  slide: ValueSlideContent;
  index: number;
  count: number;
  onAdvance: () => void;
};

/**
 * One page of the three-step value story — nodes 45:53, 45:71 and 45:89, which
 * differ only in artwork, copy, which dot is active and the last one's label.
 *
 * The illustration is decorative: every slide states the same thing in its
 * title and description, so announcing the artwork too would just repeat it.
 */
export function ValueSlide({ slide, index, count, onAdvance }: ValueSlideProps) {
  return (
    <Screen edges={['top', 'bottom']}>
      <Content>
        <Illustration
          source={slide.image}
          contentFit="cover"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <Title accessibilityRole="header">{slide.title}</Title>
        <Description>{slide.description}</Description>
        <PagerDots index={index} count={count} />
        <ActionSlot>
          <OnboardingAction label={slide.action} family="display" onPress={onAdvance} />
        </ActionSlot>
      </Content>
    </Screen>
  );
}
