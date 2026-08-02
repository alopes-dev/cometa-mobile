import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text, RatingBadge, FavoriteButton } from '@/components/design-system/atoms';
import { formatDeliveryFee } from '../../format';
import type { Restaurant } from '../../types';
import { Container, ImageWrapper, RatingBadgeWrapper, InfoRow, MetaRow } from './RestaurantCard.styles';

export type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export function RestaurantCard({
  restaurant,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: RestaurantCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Container>
        <ImageWrapper>
          <Image
            source={{ uri: restaurant.imageUrl }}
            style={{ width: '100%', height: 190, borderRadius: 16 }}
            contentFit="cover"
          />
          <RatingBadgeWrapper>
            <RatingBadge rating={restaurant.rating} />
          </RatingBadgeWrapper>
        </ImageWrapper>
        <InfoRow>
          <Text variant="bodyEmphasized" numberOfLines={1} style={{ flex: 1 }}>
            {restaurant.name}
          </Text>
          {onToggleFavorite ? (
            <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} size={32} />
          ) : null}
        </InfoRow>
        <MetaRow>
          <Text variant="footnote" color="textSecondary">
            {restaurant.cuisine} • {restaurant.deliveryTimeMinutes} min • {formatDeliveryFee(restaurant.deliveryFee)}
          </Text>
        </MetaRow>
      </Container>
    </Pressable>
  );
}
