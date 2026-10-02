import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { getCategoryIcon } from '../../categoryIcons';
import type { HomeCategory } from '../../types';
import { Container, IconTile, Tile } from './CategoryTileList.styles';

const ICON_SIZE = 24;

export type CategoryTileListProps = {
  categories: HomeCategory[];
  /** The active craving, or `null` when the customer has not narrowed down. */
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
};

type CategoryTileProps = {
  category: HomeCategory;
  selected: boolean;
  onPress: () => void;
};

function CategoryTile({ category, selected, onPress }: CategoryTileProps) {
  const { style: bounceStyle, bounce } = useBounceAnimation(0.94);

  const handlePress = () => {
    // `selectionAsync` rather than an impact: this is choosing among options,
    // which is the lighter tick iOS uses for pickers and segmented controls.
    Haptics.selectionAsync().catch(() => {});
    bounce();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={category.label}
      accessibilityState={{ selected }}
    >
      <Animated.View style={bounceStyle}>
        <Tile>
          <IconTile selected={selected}>
            <Icon
              {...getCategoryIcon(category.label)}
              size={ICON_SIZE}
              color={selected ? 'brand' : 'primary'}
            />
          </IconTile>
          <Text variant="micro" color={selected ? 'brand' : 'primary'} numberOfLines={1}>
            {category.label}
          </Text>
        </Tile>
      </Animated.View>
    </Pressable>
  );
}

/**
 * "O que te apetece?" — node 48:19801.
 *
 * A fixed row rather than a carousel: the board curates exactly four tiles and
 * spaces them edge to edge, so there is nothing offscreen to scroll to.
 * Tapping the active tile clears it, which is the only way back to the
 * unfiltered feed without a second control.
 */
export function CategoryTileList({ categories, selected, onSelect }: CategoryTileListProps) {
  return (
    <Container>
      {categories.map((category) => (
        <CategoryTile
          key={category.id}
          category={category}
          selected={selected === category.id}
          onPress={() => onSelect(selected === category.id ? null : category.id)}
        />
      ))}
    </Container>
  );
}
