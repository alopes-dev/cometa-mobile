import { Pressable } from 'react-native';
import { Icon } from '../Icon';
import { Container, StepButton, Value } from './QuantityStepper.styles';

export type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QuantityStepper({ quantity, onIncrement, onDecrement }: QuantityStepperProps) {
  return (
    <Container>
      <Pressable onPress={onDecrement} accessibilityRole="button" accessibilityLabel="Diminuir quantidade" hitSlop={8}>
        <StepButton variant="decrement">
          <Icon name="remove" sf="minus" size={14} color="textPrimary" />
        </StepButton>
      </Pressable>
      <Value>{quantity}</Value>
      <Pressable onPress={onIncrement} accessibilityRole="button" accessibilityLabel="Aumentar quantidade" hitSlop={8}>
        <StepButton variant="increment">
          <Icon name="add" sf="plus" size={14} color="onPrimary" />
        </StepButton>
      </Pressable>
    </Container>
  );
}
