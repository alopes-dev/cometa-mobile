import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text, Icon } from '@/components/design-system/atoms';
import { Card } from '@/components/design-system/molecules';
import type { Restaurant } from '../../types';
import { InfoRow, MetaRow } from './RestaurantCard.styles';

export type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress: () => void;
};

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card>
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={{ width: '100%', height: 140, borderRadius: 12 }}
          contentFit="cover"
        />
        <InfoRow>
          <Text variant="bodyEmphasized">{restaurant.name}</Text>
          <MetaRow>
            <Icon name="star" sf="star.fill" size={14} color="warning" />
            <Text variant="footnote" color="textSecondary">
              {restaurant.rating.toFixed(1)}
            </Text>
          </MetaRow>
        </InfoRow>
        <Text variant="footnote" color="textSecondary">
          {restaurant.cuisine}
        </Text>
        <Text variant="footnote" color="textSecondary">
          {restaurant.deliveryTimeMinutes} min · {restaurant.deliveryFee} Kz
        </Text>
      </Card>
    </Pressable>
  );
}
