import { Pressable } from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { Container, StepButton } from './QuantityStepper.styles';

export type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function QuantityStepper({ quantity, onIncrement, onDecrement }: QuantityStepperProps) {
  return (
    <Container>
      <Pressable onPress={onDecrement} accessibilityRole="button" accessibilityLabel="Diminuir quantidade" hitSlop={8}>
        <StepButton>
          <Icon name="remove" sf="minus" size={14} color="textPrimary" />
        </StepButton>
      </Pressable>
      <Text variant="bodyEmphasized">{quantity}</Text>
      <Pressable onPress={onIncrement} accessibilityRole="button" accessibilityLabel="Aumentar quantidade" hitSlop={8}>
        <StepButton>
          <Icon name="add" sf="plus" size={14} color="textPrimary" />
        </StepButton>
      </Pressable>
    </Container>
  );
}
