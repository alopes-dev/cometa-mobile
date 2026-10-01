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
        <Text variant="body" color="textSecondary">
          Subtotal
        </Text>
        <Text variant="body">{formatKwanza(summary.subtotal)}</Text>
      </Row>
      <Row>
        <Text variant="body" color="textSecondary">
          Delivery
        </Text>
        <Text variant="body" color={summary.delivery === 0 ? 'primary' : 'textPrimary'}>
          {formatDeliveryFee(summary.delivery)}
        </Text>
      </Row>
      {summary.discount > 0 ? (
        <Row>
          <Text variant="body" color="textSecondary">
            Desconto
          </Text>
          <Text variant="body" color="primary">
            -{formatKwanza(summary.discount)}
          </Text>
        </Row>
      ) : null}
      {summary.tip > 0 ? (
        <Row>
          <Text variant="body" color="textSecondary">
            Gorjeta
          </Text>
          <Text variant="body">{formatKwanza(summary.tip)}</Text>
        </Row>
      ) : null}
      <Row>
        <Text variant="body" color="textSecondary">
          VAT (14%)
        </Text>
        <Text variant="body">{formatKwanza(summary.vat)}</Text>
      </Row>
      <Divider />
      <Row>
        <Text variant="bodyEmphasized">Total</Text>
        <Text variant="bodyEmphasized" color="primary">
          {formatKwanza(summary.total)}
        </Text>
      </Row>
    </Container>
  );
}
