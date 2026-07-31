import { Text } from '../Text';
import { VARIANT_COLOR, NumberBadge, DotBadge, type BadgeVariant } from './Badge.styles';

export type BadgeProps = {
  count?: number;
  variant?: BadgeVariant;
};

export function Badge({ count, variant = 'error' }: BadgeProps) {
  if (count === 0) return null;

  const color = VARIANT_COLOR[variant];

  if (count === undefined) {
    return <DotBadge color={color} />;
  }

  return (
    <NumberBadge color={color}>
      <Text variant="caption" color="onPrimary">
        {count > 99 ? '99+' : String(count)}
      </Text>
    </NumberBadge>
  );
}
