import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Icon } from '@/components/design-system/atoms';
import type { Restaurant } from '../../types';
import {
  BottomContent,
  Container,
  IconButton,
  RatedBadge,
  RatingRow,
  TopBar,
  TopBarActions,
} from './RestaurantHero.styles';

const TOP_RATED_THRESHOLD = 4.5;

export type RestaurantHeroProps = {
  restaurant: Restaurant;
  topInset: number;
  onBack: () => void;
  onSearch?: () => void;
  onShare?: () => void;
};

export function RestaurantHero({ restaurant, topInset, onBack, onSearch, onShare }: RestaurantHeroProps) {
  return (
    <Container>
      <Image source={{ uri: restaurant.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
        style={StyleSheet.absoluteFill}
      />
      <TopBar topInset={topInset}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <IconButton>
            <Icon name="chevron-back" sf="chevron.left" size={20} color="onSecondary" />
          </IconButton>
        </Pressable>
        <TopBarActions>
          <Pressable onPress={onSearch} accessibilityRole="button" accessibilityLabel="Buscar no menu" hitSlop={8}>
            <IconButton>
              <Icon name="search" sf="magnifyingglass" size={18} color="onSecondary" />
            </IconButton>
          </Pressable>
          <Pressable onPress={onShare} accessibilityRole="button" accessibilityLabel="Partilhar" hitSlop={8}>
            <IconButton>
              <Icon name="share-outline" sf="square.and.arrow.up" size={18} color="onSecondary" />
            </IconButton>
          </Pressable>
        </TopBarActions>
      </TopBar>
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
    </Container>
  );
}
