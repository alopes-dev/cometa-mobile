import { Dimensions, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, RatingBadge, FavoriteButton } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation';
import { useMeasureOnTap } from '@/hooks/useMeasureOnTap';
import { useHeroTransition } from '../HeroTransition';
import { HERO_MAX_HEIGHT } from '../RestaurantHero';
import { formatDeliveryFee } from '../../format';
import type { Restaurant } from '../../types';
import { Container, ImageWrapper, RatingBadgeWrapper, InfoRow, MetaRow } from './RestaurantCard.styles';

const MAX_STAGGERED_INDEX = 6;
const STAGGER_STEP_MS = 40;

export type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  /** Position in its list, used to stagger the entrance animation (capped). */
  index?: number;
  /** Extra delay before the stagger starts — e.g. to wait out a screen's own header animation. */
  entranceDelayMs?: number;
};

export function RestaurantCard({
  restaurant,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  index = 0,
  entranceDelayMs = 0,
}: RestaurantCardProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();
  const entranceStyle = useEntranceAnimation(entranceDelayMs + Math.min(index, MAX_STAGGERED_INDEX) * STAGGER_STEP_MS);
  const insets = useSafeAreaInsets();
  const { startTransition } = useHeroTransition();
  const { ref: imageRef, measure } = useMeasureOnTap();

  const handlePress = async () => {
    const origin = await measure();
    if (origin.width > 0) {
      startTransition(restaurant.imageUrl, origin, {
        x: 0,
        y: 0,
        width: Dimensions.get('window').width,
        height: HERO_MAX_HEIGHT + insets.top,
      });
    }
    onPress();
  };

  return (
    <Animated.View style={entranceStyle}>
      <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button">
        <Animated.View style={pressStyle}>
          <Container>
            <View ref={imageRef}>
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
            </View>
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
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
