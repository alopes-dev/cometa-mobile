import type { StyleProp, ViewStyle } from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { Container } from './RatingBadge.styles';

export type RatingBadgeProps = {
  rating: number;
  variant?: 'floating' | 'plain';
  style?: StyleProp<ViewStyle>;
};

export function RatingBadge({ rating, variant = 'floating', style }: RatingBadgeProps) {
  return (
    <Container variant={variant} style={style}>
      <Icon name="star" sf="star.fill" size={14} color="warning" />
      <Text variant="footnote" color={variant === 'floating' ? 'textPrimary' : 'onSecondary'}>
        {rating.toFixed(1)}
      </Text>
    </Container>
  );
}
