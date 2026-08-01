import { Pressable } from 'react-native';
import { formatKwanza } from '../../format';
import { Container, CountBadge, CountText, Label, LabelText, TotalText } from './CartSummaryBar.styles';

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
          <CountText>{count > 99 ? '99+' : String(count)}</CountText>
        </CountBadge>
        <Label>
          <LabelText>Ver carrinho</LabelText>
        </Label>
        <TotalText>{formatKwanza(total)}</TotalText>
      </Container>
    </Pressable>
  );
}
