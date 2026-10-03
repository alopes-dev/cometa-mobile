import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Icon, QuantityStepper } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import { product } from '@/theme';
import { AddLabel, AddSlot, AddSurface, Row } from './ProductActionRow.styles';

export type ProductActionRowProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** `Etiqueta` — node 48:20730, e.g. "Adicionar · 4.500 Kz". */
  addLabel: string;
  /** Swaps the label for "Adicionado ✓" — node 48:20770. */
  added: boolean;
  disabled: boolean;
  onAdd: () => void;
};

/** `Quantidade e ação` — node 48:20723. */
export function ProductActionRow({
  quantity,
  onIncrement,
  onDecrement,
  addLabel,
  added,
  disabled,
  onAdd,
}: ProductActionRowProps) {
  // The board annotates its own press feedback on node 48:20731 — scale 0,98
  // over 150ms — rather than inheriting the app's default press timing.
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale(
    product.motion.pressScale,
    product.motion.pressDuration
  );

  return (
    <Row>
      <QuantityStepper
        variant="panel"
        quantity={quantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
      <AddSlot>
        <Pressable
          onPress={disabled ? undefined : onAdd}
          onPressIn={disabled ? undefined : onPressIn}
          onPressOut={disabled ? undefined : onPressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
        >
          <Animated.View style={pressStyle}>
            <AddSurface disabled={disabled}>
              <AddLabel numberOfLines={1}>{added ? 'Adicionado' : addLabel}</AddLabel>
              {added ? <Icon name="checkmark" sf="checkmark" size={16} color="onBrand" /> : null}
            </AddSurface>
          </Animated.View>
        </Pressable>
      </AddSlot>
    </Row>
  );
}
