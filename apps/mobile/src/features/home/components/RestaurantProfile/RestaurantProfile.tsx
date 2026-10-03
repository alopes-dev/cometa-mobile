import { useTheme } from 'styled-components/native';
import { Icon, type IconProps } from '@/components/design-system/atoms';
import {
  formatDeliveryFee,
  formatDeliveryWindow,
  formatMinimumOrder,
  formatRating,
  formatReviewCount,
} from '../../format';
import type { Restaurant } from '../../types';
import {
  Container,
  DeliveryFact,
  DeliveryFactLabel,
  DeliveryStrip,
  Description,
  Identity,
  Name,
  Placing,
  RatingRow,
  RatingValue,
  ReviewCount,
} from './RestaurantProfile.styles';

export type RestaurantProfileProps = {
  restaurant: Restaurant;
};

type Fact = {
  key: string;
  name: IconProps['name'];
  sf: IconProps['sf'];
  value: string;
};

/** Identity, delivery facts and description — `Perfil`, node 48:20613. */
export function RestaurantProfile({ restaurant }: RestaurantProfileProps) {
  const theme = useTheme();
  // The board writes "cuisine · area" (node 48:20616); a restaurant without a
  // recorded area shows the cuisine alone rather than a dangling separator.
  const placing = [restaurant.cuisine, restaurant.neighbourhood].filter(Boolean).join(' · ');

  const facts: Fact[] = [
    {
      key: 'time',
      name: 'time-outline',
      sf: 'clock',
      value: formatDeliveryWindow(restaurant.deliveryTimeMinutes),
    },
    {
      key: 'fee',
      name: 'bicycle',
      sf: 'bicycle',
      value: formatDeliveryFee(restaurant.deliveryFee),
    },
    {
      key: 'minimum',
      name: 'bag-outline',
      sf: 'bag',
      value: formatMinimumOrder(restaurant.minOrderValue),
    },
  ];

  return (
    <Container>
      <Identity>
        <Name>{restaurant.name}</Name>
        <Placing>{placing}</Placing>
        <RatingRow>
          <Icon name="star" sf="star.fill" size={theme.business.metrics.starSize} color="rating" />
          <RatingValue>{formatRating(restaurant.rating)}</RatingValue>
          <ReviewCount>{formatReviewCount(restaurant.reviewCount)}</ReviewCount>
        </RatingRow>
      </Identity>

      <DeliveryStrip>
        {facts.map((fact) => (
          <DeliveryFact key={fact.key}>
            {/* Drawn in the brand green on the board, not in the label's grey. */}
            <Icon
              name={fact.name}
              sf={fact.sf}
              size={theme.business.metrics.factIconSize}
              color="brand"
            />
            <DeliveryFactLabel>{fact.value}</DeliveryFactLabel>
          </DeliveryFact>
        ))}
      </DeliveryStrip>

      <Description>{restaurant.description}</Description>
    </Container>
  );
}
