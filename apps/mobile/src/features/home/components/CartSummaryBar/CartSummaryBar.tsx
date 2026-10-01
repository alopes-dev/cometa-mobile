import { useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatKwanza } from '../../format';
import { Container, CountBadge, CountText, Label, LabelText, TotalText } from './CartSummaryBar.styles';

export type CartSummaryBarProps = {
  count: number;
  total: number;
  onPress?: () => void;
};

export function CartSummaryBar({ count, total, onPress }: CartSummaryBarProps) {
  const reducedMotion = useReducedMotion();
  const { style: bounceStyle, bounce } = useBounceAnimation();
  const previousCount = useRef(count);
  const hasEntered = useRef(count > 0);
  const translateY = useSharedValue(hasEntered.current || reducedMotion ? 0 : 40);

  useEffect(() => {
    // First transition from empty to non-empty: slide the bar in (§20). Any
    // later increment (bar already visible) just bounces, it doesn't re-enter.
    if (count > 0 && !hasEntered.current) {
      hasEntered.current = true;
      if (!reducedMotion) {
        translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
      }
    }
    if (count > previousCount.current) {
      bounce();
    }
    previousCount.current = count;
  }, [count]);

  const slideStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  if (count <= 0) return null;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Ver carrinho">
      <Animated.View style={slideStyle}>
        <Animated.View style={bounceStyle}>
          <Container>
            <CountBadge>
              <CountText>{count > 99 ? '99+' : String(count)}</CountText>
            </CountBadge>
            <Label>
              <LabelText>Ver carrinho</LabelText>
            </Label>
            <TotalText>{formatKwanza(total)}</TotalText>
          </Container>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
