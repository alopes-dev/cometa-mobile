import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { Text, Icon, type IconProps } from '@/components/design-system/atoms';
import { restaurantDetailPalette as palette } from '../../restaurantDetailPalette';
import type { Restaurant } from '../../types';
import {
  BottomContent,
  CompactTitleWrapper,
  IconButton,
  IconButtonStack,
  RatedBadge,
  RatingRow,
  TopBar,
  TopBarActions,
} from './RestaurantHero.styles';

const TOP_RATED_THRESHOLD = 4.5;

// Airbnb-style collapsing header: shrinks from HERO_MAX_HEIGHT to
// HEADER_COMPACT_HEIGHT over COLLAPSE_RANGE px of scroll (plus a bit of
// stretch on iOS overscroll bounce).
export const HERO_MAX_HEIGHT = 340;
export const HEADER_COMPACT_HEIGHT = 56;
export const COLLAPSE_RANGE = HERO_MAX_HEIGHT - HEADER_COMPACT_HEIGHT;
const BOUNCE_STRETCH = 200;

export type RestaurantHeroProps = {
  restaurant: Restaurant;
  topInset: number;
  scrollY: SharedValue<number>;
  onBack: () => void;
  onSearch?: () => void;
  onShare?: () => void;
};

function HeaderIconButton({
  name,
  sf,
  label,
  onPress,
  progress,
}: {
  name: IconProps['name'];
  sf?: IconProps['sf'];
  label: string;
  onPress?: () => void;
  progress: SharedValue<number>;
}) {
  const backgroundStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const lightIconStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const darkIconStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8}>
      <IconButtonStack>
        <Animated.View style={[StyleSheet.absoluteFill, backgroundStyle]}>
          <IconButton />
        </Animated.View>
        <Animated.View style={[iconLayerStyle, lightIconStyle]}>
          <Icon name={name} sf={sf} size={20} color="onSecondary" />
        </Animated.View>
        <Animated.View style={[iconLayerStyle, darkIconStyle]}>
          <Icon name={name} sf={sf} size={20} color="textPrimary" />
        </Animated.View>
      </IconButtonStack>
    </Pressable>
  );
}

const iconLayerStyle = StyleSheet.absoluteFill;

const heroPositionStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  overflow: 'hidden' as const,
};

export function RestaurantHero({ restaurant, topInset, scrollY, onBack, onSearch, onShare }: RestaurantHeroProps) {
  const maxHeight = HERO_MAX_HEIGHT + topInset;
  const compactHeight = HEADER_COMPACT_HEIGHT + topInset;

  const progress = useDerivedValue(() =>
    interpolate(scrollY.value, [0, COLLAPSE_RANGE], [0, 1], Extrapolation.CLAMP)
  );

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [-BOUNCE_STRETCH, 0, COLLAPSE_RANGE],
      [maxHeight + BOUNCE_STRETCH, maxHeight, compactHeight],
      Extrapolation.CLAMP
    );
    return { height };
  });

  const imageAndScrimStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const solidBackgroundStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const compactTitleStyle = useAnimatedStyle(() => {
    const value = interpolate(scrollY.value, [COLLAPSE_RANGE * 0.5, COLLAPSE_RANGE], [0, 1], Extrapolation.CLAMP);
    return { opacity: value };
  });
  const largeTitleStyle = useAnimatedStyle(() => {
    const value = interpolate(scrollY.value, [0, COLLAPSE_RANGE * 0.5], [1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [0, COLLAPSE_RANGE], [0, -20], Extrapolation.CLAMP);
    return { opacity: value, transform: [{ translateY }] };
  });

  return (
    <Animated.View style={[heroPositionStyle, { backgroundColor: palette.background }, containerAnimatedStyle]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: palette.background }, solidBackgroundStyle]} />
      <Animated.View style={[StyleSheet.absoluteFill, imageAndScrimStyle]}>
        <Image source={{ uri: restaurant.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <TopBar topInset={topInset}>
        <HeaderIconButton name="chevron-back" sf="chevron.left" label="Voltar" onPress={onBack} progress={progress} />
        <TopBarActions>
          <HeaderIconButton
            name="search"
            sf="magnifyingglass"
            label="Buscar no menu"
            onPress={onSearch}
            progress={progress}
          />
          <HeaderIconButton
            name="share-outline"
            sf="square.and.arrow.up"
            label="Partilhar"
            onPress={onShare}
            progress={progress}
          />
        </TopBarActions>
      </TopBar>

      <Animated.View style={compactTitleStyle}>
        <CompactTitleWrapper topInset={topInset}>
          <Text variant="bodyEmphasized" numberOfLines={1}>
            {restaurant.name}
          </Text>
        </CompactTitleWrapper>
      </Animated.View>

      <Animated.View style={largeTitleStyle}>
        <BottomContent>
          {restaurant.rating >= TOP_RATED_THRESHOLD ? (
            <RatedBadge>
              <Text variant="caption" color="onSecondary">
                MAIS BEM AVALIADO
              </Text>
            </RatedBadge>
          ) : null}
          <RatingRow>
            <Icon name="star" sf="star.fill" size={14} color="warning" />
            <Text variant="footnote" color="onSecondary">
              {restaurant.rating.toFixed(1)}
            </Text>
          </RatingRow>
          <Text variant="title1" color="onSecondary">
            {restaurant.name}
          </Text>
          <Text variant="footnote" color="onSecondary">
            {restaurant.description}
          </Text>
        </BottomContent>
      </Animated.View>
    </Animated.View>
  );
}
