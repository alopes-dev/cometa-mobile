import { Image } from 'expo-image';
import { QuantityStepper, Text } from '@/components/design-system/atoms';
import { formatKwanza } from '@/features/home/format';
import type { CartItem } from '@/hooks/CartProvider';
import { describeCartLine } from '../../cartDisplay';
import { Container, Thumbnail, Info, PriceText } from './OrderItemRow.styles';

export type OrderItemRowProps = {
  entry: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function OrderItemRow({ entry, onIncrement, onDecrement }: OrderItemRowProps) {
  const { item, quantity, selections, notes, unitPrice } = entry;
  return (
    <Container>
      <Thumbnail>
        <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </Thumbnail>
      <Info>
        <Text variant="bodyEmphasized" numberOfLines={1}>
          {item.name}
        </Text>
        <Text variant="footnote" color="textSecondary" numberOfLines={2}>
          {describeCartLine(item, selections, notes)}
        </Text>
        <PriceText>{formatKwanza(unitPrice)}</PriceText>
      </Info>
      <QuantityStepper quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
    </Container>
  );
}
