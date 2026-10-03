import { Pressable } from 'react-native';
import { Icon } from '../Icon';
import {
  Container,
  PanelContainer,
  PanelSign,
  PanelValue,
  StepButton,
  Value,
} from './QuantityStepper.styles';

/**
 * `pill` is the compact control used inside a cart row. `panel` is the
 * product board's control — node 48:20724 — which sits beside the add-to-cart
 * button and shares its height and radius.
 */
export type QuantityStepperVariant = 'pill' | 'panel';

export type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  variant?: QuantityStepperVariant;
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  variant = 'pill',
}: QuantityStepperProps) {
  if (variant === 'panel') {
    return (
      <PanelContainer>
        <Pressable
          onPress={onDecrement}
          accessibilityRole="button"
          accessibilityLabel="Diminuir quantidade"
          hitSlop={12}
        >
          {/* U+2212, the typographic minus the board sets — not a hyphen. */}
          <PanelSign>−</PanelSign>
        </Pressable>
        <PanelValue>{quantity}</PanelValue>
        <Pressable
          onPress={onIncrement}
          accessibilityRole="button"
          accessibilityLabel="Aumentar quantidade"
          hitSlop={12}
        >
          <PanelSign accent>+</PanelSign>
        </Pressable>
      </PanelContainer>
    );
  }

  return (
    <Container>
      <Pressable onPress={onDecrement} accessibilityRole="button" accessibilityLabel="Diminuir quantidade" hitSlop={8}>
        <StepButton variant="decrement">
          <Icon name="remove" sf="minus" size={14} color="primary" />
        </StepButton>
      </Pressable>
      <Value>{quantity}</Value>
      <Pressable onPress={onIncrement} accessibilityRole="button" accessibilityLabel="Aumentar quantidade" hitSlop={8}>
        <StepButton variant="increment">
          <Icon name="add" sf="plus" size={14} color="onBrand" />
        </StepButton>
      </Pressable>
    </Container>
  );
}
