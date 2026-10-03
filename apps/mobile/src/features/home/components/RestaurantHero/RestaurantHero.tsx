import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { FavoriteButton, Icon, Text } from '@/components/design-system/atoms';
import { business } from '@/theme';
import type { Restaurant } from '../../types';
import {
  ActionButton,
  ActionGroup,
  ActionShadow,
  Actions,
  CompactTitleWrapper,
} from './RestaurantHero.styles';

/** `Hero` — node 48:20602. */
export const HERO_MAX_HEIGHT = business.metrics.heroHeight;
export const HEADER_COMPACT_HEIGHT = 56;
export const COLLAPSE_RANGE = HERO_MAX_HEIGHT - HEADER_COMPACT_HEIGHT;

const BOUNCE_STRETCH = 200;

export type RestaurantHeroProps = {
  restaurant: Restaurant;
  topInset: number;
  scrollY: SharedValue<number>;
  onBack: () => void;
  onShare?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const heroPositionStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  overflow: 'hidden' as const,
};

export function RestaurantHero({
  restaurant,
  topInset,
  scrollY,
  onBack,
  onShare,
  isFavorite = false,
  onToggleFavorite,
}: RestaurantHeroProps) {
  const theme = useTheme();
  const maxHeight = HERO_MAX_HEIGHT + topInset;
  const compactHeight = HEADER_COMPACT_HEIGHT + topInset;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [-BOUNCE_STRETCH, 0, COLLAPSE_RANGE],
      [maxHeight + BOUNCE_STRETCH, maxHeight, compactHeight],
      Extrapolation.CLAMP
    ),
  }));

  const mediaStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, COLLAPSE_RANGE], [1, 0], Extrapolation.CLAMP),
  }));

  const solidBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, COLLAPSE_RANGE], [0, 1], Extrapolation.CLAMP),
  }));

  // Held back until the photograph is half gone, so the two never read as one
  // title sliding over another.
  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_RANGE * 0.5, COLLAPSE_RANGE],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View
      style={[
        heroPositionStyle,
        { backgroundColor: theme.colors.background.primary },
        containerAnimatedStyle,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.colors.background.primary },
          solidBackgroundStyle,
        ]}
      />
      <Animated.View style={[StyleSheet.absoluteFill, mediaStyle]}>
        <Image source={restaurant.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={business.heroScrim.colors}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: business.metrics.scrimHeight + topInset,
          }}
        />
      </Animated.View>

      <Animated.View style={compactTitleStyle}>
        <CompactTitleWrapper topInset={topInset}>
          <Text variant="title" numberOfLines={1}>
            {restaurant.name}
          </Text>
        </CompactTitleWrapper>
      </Animated.View>

      <Actions topInset={topInset}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
        >
          <ActionShadow>
            <ActionButton>
              <Icon
                name="chevron-back"
                sf="chevron.left"
                size={business.metrics.actionIconSize}
                color="primary"
              />
            </ActionButton>
          </ActionShadow>
        </Pressable>
        <ActionGroup>
          {onShare ? (
            <Pressable
              onPress={onShare}
              accessibilityRole="button"
              accessibilityLabel="Partilhar"
              hitSlop={8}
            >
              <ActionShadow>
                <ActionButton>
                  <Icon
                    name="share-outline"
                    sf="square.and.arrow.up"
                    size={business.metrics.actionIconSize}
                    color="primary"
                  />
                </ActionButton>
              </ActionShadow>
            </Pressable>
          ) : null}
          {onToggleFavorite ? (
            <ActionShadow>
              <FavoriteButton
                size={business.metrics.actionSize}
                isFavorite={isFavorite}
                onToggle={onToggleFavorite}
              />
            </ActionShadow>
          ) : null}
        </ActionGroup>
      </Actions>
    </Animated.View>
  );
}
