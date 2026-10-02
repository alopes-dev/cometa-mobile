import { Dimensions, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon, FavoriteButton } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation';
import { useMeasureOnTap } from '@/hooks/useMeasureOnTap';
import { useHeroTransition } from '../HeroTransition';
import { HERO_MAX_HEIGHT } from '../RestaurantHero';
import { formatDeliveryFee, formatDeliveryWindow, formatRating } from '../../format';
import type { Restaurant } from '../../types';
import {
  Container,
  FAVORITE_SIZE,
  FavoriteSlot,
  ImageWrapper,
  InfoRow,
  PromotionBadge,
  RatingRow,
} from './RestaurantCard.styles';

const MAX_STAGGERED_INDEX = 6;
const STAGGER_STEP_MS = 40;

export type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  /**
   * Fixed width, for a card in a carousel. Omit it and the card fills its
   * parent, which is the form "Perto de ti" and "Pedir novamente" take.
   */
  width?: number;
  /**
   * Replaces the delivery meta line — "Último pedido · 12.000 Kz" on the
   * reorder card (node 48:19919), where the time and fee are not the point.
   */
  footnote?: string;
  /**
   * Whether tapping flies the card's image into the detail hero. Only true
   * where a hero actually receives it — otherwise the ghost expands toward a
   * screen that never arrives.
   */
  enableHeroTransition?: boolean;
  /** Position in its list, used to stagger the entrance animation (capped). */
  index?: number;
  /** Extra delay before the stagger starts — e.g. to wait out a screen's own header animation. */
  entranceDelayMs?: number;
};

/**
 * A restaurant in a Home feed — node 48:19831.
 *
 * One component covers both shapes the board draws: the 250px carousel card
 * and the full-bleed card, which differ only in width.
 */
export function RestaurantCard({
  restaurant,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  width,
  footnote,
  enableHeroTransition = true,
  index = 0,
  entranceDelayMs = 0,
}: RestaurantCardProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();
  const entranceStyle = useEntranceAnimation(entranceDelayMs + Math.min(index, MAX_STAGGERED_INDEX) * STAGGER_STEP_MS);
  const insets = useSafeAreaInsets();
  const { startTransition } = useHeroTransition();
  const { ref: imageRef, measure } = useMeasureOnTap();

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (!enableHeroTransition) {
      onPress();
      return;
    }
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

  const subtitle = restaurant.neighbourhood
    ? `${restaurant.cuisine} · ${restaurant.neighbourhood}`
    : restaurant.cuisine;

  const meta =
    footnote ??
    `★ ${formatRating(restaurant.rating)} · ${formatDeliveryWindow(restaurant.deliveryTimeMinutes)} · ${formatDeliveryFee(restaurant.deliveryFee)}`;

  return (
    <Animated.View style={entranceStyle}>
      <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button">
        <Animated.View style={pressStyle}>
          <Container width={width}>
            <View ref={imageRef}>
              <ImageWrapper>
                <Image
                  source={restaurant.imageUrl}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
                {restaurant.promotionLabel ? (
                  <PromotionBadge>
                    <Text variant="labelSmall" color="onBrand">
                      {restaurant.promotionLabel}
                    </Text>
                  </PromotionBadge>
                ) : null}
                {onToggleFavorite ? (
                  <FavoriteSlot>
                    <FavoriteButton
                      isFavorite={isFavorite}
                      onToggle={onToggleFavorite}
                      size={FAVORITE_SIZE}
                      variant="floating"
                    />
                  </FavoriteSlot>
                ) : null}
              </ImageWrapper>
            </View>
            <InfoRow>
              <Text variant="h6" numberOfLines={1} style={{ flex: 1 }}>
                {restaurant.name}
              </Text>
              <RatingRow>
                <Text variant="label">{formatRating(restaurant.rating)}</Text>
                <Icon name="star" sf="star.fill" size={12} color="rating" />
              </RatingRow>
            </InfoRow>
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {subtitle}
            </Text>
            <Text variant="micro" color="muted" numberOfLines={1}>
              {meta}
            </Text>
          </Container>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
