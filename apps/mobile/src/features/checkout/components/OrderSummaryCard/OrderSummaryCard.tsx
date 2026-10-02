import { Text } from '@/components/design-system/atoms';
import { formatKwanza, formatDeliveryFee } from '@/features/home/format';
import type { OrderSummary } from '../../types';
import { Container, Row, Divider } from './OrderSummaryCard.styles';

export type OrderSummaryCardProps = {
  summary: OrderSummary;
};

export function OrderSummaryCard({ summary }: OrderSummaryCardProps) {
  return (
    <Container>
      <Row>
        <Text variant="bodyLarge" color="secondary">
          Subtotal
        </Text>
        <Text variant="bodyLarge">{formatKwanza(summary.subtotal)}</Text>
      </Row>
      <Row>
        <Text variant="bodyLarge" color="secondary">
          Delivery
        </Text>
        <Text variant="bodyLarge" color={summary.delivery === 0 ? 'primary' : 'primary'}>
          {formatDeliveryFee(summary.delivery)}
        </Text>
      </Row>
      {summary.discount > 0 ? (
        <Row>
          <Text variant="bodyLarge" color="secondary">
            Desconto
          </Text>
          <Text variant="bodyLarge" color="brand">
            -{formatKwanza(summary.discount)}
          </Text>
        </Row>
      ) : null}
      {summary.tip > 0 ? (
        <Row>
          <Text variant="bodyLarge" color="secondary">
            Gorjeta
          </Text>
          <Text variant="bodyLarge">{formatKwanza(summary.tip)}</Text>
        </Row>
      ) : null}
      <Row>
        <Text variant="bodyLarge" color="secondary">
          VAT (14%)
        </Text>
        <Text variant="bodyLarge">{formatKwanza(summary.vat)}</Text>
      </Row>
      <Divider />
      <Row>
        <Text variant="title">Total</Text>
        <Text variant="title" color="brand">
          {formatKwanza(summary.total)}
        </Text>
      </Row>
    </Container>
  );
}
