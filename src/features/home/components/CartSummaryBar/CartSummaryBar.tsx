import { Pressable } from 'react-native';
import { Text } from '@/components/design-system/atoms';
import { formatKwanza } from '../../format';
import { Container, CountBadge, Label } from './CartSummaryBar.styles';

export type CartSummaryBarProps = {
  count: number;
  total: number;
  onPress?: () => void;
};

export function CartSummaryBar({ count, total, onPress }: CartSummaryBarProps) {
  if (count <= 0) return null;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Ver carrinho">
      <Container>
        <CountBadge>
          <Text variant="footnote" color="onSecondary">
            {count > 99 ? '99+' : String(count)}
          </Text>
        </CountBadge>
        <Label>
          <Text variant="bodyEmphasized" color="onPrimary">
            Ver carrinho
          </Text>
        </Label>
        <Text variant="bodyEmphasized" color="onPrimary">
          {formatKwanza(total)}
        </Text>
      </Container>
    </Pressable>
  );
}
