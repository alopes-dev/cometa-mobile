import { Image } from 'expo-image';
import { Text } from '@/components/design-system/atoms';
import { formatKwanza } from '@/features/home/format';
import type { CartItem } from '@/hooks/CartProvider';
import { QuantityStepper } from '../QuantityStepper';
import { Container, Thumbnail, Info, PriceText } from './OrderItemRow.styles';

export type OrderItemRowProps = {
  entry: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function OrderItemRow({ entry, onIncrement, onDecrement }: OrderItemRowProps) {
  const { item, quantity } = entry;
  return (
    <Container>
      <Thumbnail>
        <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </Thumbnail>
      <Info>
        <Text variant="bodyEmphasized" numberOfLines={1}>
          {item.name}
        </Text>
        <Text variant="footnote" color="textSecondary" numberOfLines={1}>
          {item.description}
        </Text>
        <PriceText>{formatKwanza(item.price)}</PriceText>
      </Info>
      <QuantityStepper quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
    </Container>
  );
}
