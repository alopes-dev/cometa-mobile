import { useCallback, useRef } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { ValueSlide, WelcomeHero, valueSlides } from '@/features/onboarding';
import { useOnboarding } from '@/hooks/useOnboarding';

/** The welcome hero sits before the three value slides — board "01 · Onboarding". */
const PAGE_COUNT = valueSlides.length + 1;

/**
 * The pre-authentication brand arrival — board "01 · Onboarding", nodes 45:40,
 * 45:53, 45:71 and 45:89.
 *
 * Built as one horizontally paged scroller rather than four stacked routes so
 * the flow can be swiped as well as tapped, and so a back swipe moves within
 * the story instead of leaving it.
 *
 * The pagination dots count the three value slides only, as drawn — the welcome
 * hero is not one of them. Each slide renders its own dots from its own index,
 * so there is no cross-page "current page" to track: the visible page is the
 * one that knows which dot is lit.
 */
export default function Onboarding() {
  const { completeOnboarding } = useOnboarding();
  const { width } = useWindowDimensions();
  const scroller = useRef<ScrollView>(null);

  const goTo = useCallback(
    (next: number) => {
      if (next >= PAGE_COUNT) {
        completeOnboarding();
        return;
      }
      scroller.current?.scrollTo({ x: next * width, animated: true });
    },
    [completeOnboarding, width]
  );

  return (
    <ScrollView
      ref={scroller}
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      // The pages are full-bleed screens, so the scroller must not inset them.
      contentInsetAdjustmentBehavior="never"
    >
      <View style={{ width }}>
        <WelcomeHero onAdvance={() => goTo(1)} />
      </View>
      {valueSlides.map((slide, index) => (
        <View key={slide.id} style={{ width }}>
          <ValueSlide
            slide={slide}
            index={index}
            count={valueSlides.length}
            onAdvance={() => goTo(index + 2)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
