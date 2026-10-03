import { useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Icon } from '@/components/design-system/atoms';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatKwanza } from '../../format';
import { Action, ActionText, Container, Positioner, Summary } from './ProductCartBar.styles';

export type ProductCartBarProps = {
  count: number;
  total: number;
  bottomInset: number;
  onPress: () => void;
};

const ENTER_DISTANCE = 96;

/**
 * `Carrinho flutuante` — node 48:20772, the bar that appears over the product
 * once something is in the cart (frame 48:20733).
 *
 * The board shows it only in the added state, so it enters rather than simply
 * being there: this is the screen's confirmation that the add landed, which is
 * what lets the product stay on screen instead of popping back to the menu.
 */
export function ProductCartBar({ count, total, bottomInset, onPress }: ProductCartBarProps) {
  const reducedMotion = useReducedMotion();
  const hasEntered = useRef(count > 0);
  const translateY = useSharedValue(count > 0 || reducedMotion ? 0 : ENTER_DISTANCE);

  useEffect(() => {
    if (count > 0 && !hasEntered.current) {
      hasEntered.current = true;
      if (!reducedMotion) {
        translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
      }
    }
  }, [count]);

  const slideStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  if (count <= 0) return null;

  return (
    <Positioner bottomInset={bottomInset} pointerEvents="box-none">
      <Animated.View style={slideStyle}>
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Ver carrinho">
          <Container>
            <Summary>
              {count} {count === 1 ? 'item' : 'itens'} · {formatKwanza(total)}
            </Summary>
            <Action>
              <ActionText>Ver carrinho</ActionText>
              <Icon name="arrow-forward" sf="arrow.right" size={14} color="brand" />
            </Action>
          </Container>
        </Pressable>
      </Animated.View>
    </Positioner>
  );
}
