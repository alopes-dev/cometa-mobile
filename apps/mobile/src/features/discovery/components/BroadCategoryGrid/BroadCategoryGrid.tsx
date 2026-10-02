import { Pressable, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { layout } from '@/theme';
import type { BroadCategory } from '../../types';
import { COLUMNS, Container, ICON_SIZE, Label, TILE_GAP, Tile } from './BroadCategoryGrid.styles';

export type BroadCategoryGridProps = {
  categories: BroadCategory[];
  onSelect: (categoryId: string) => void;
  /** Padding between the grid and each screen edge; used to size the columns. */
  horizontalInset?: number;
};

type BroadCategoryTileProps = {
  category: BroadCategory;
  width: number;
  onPress: () => void;
};

function BroadCategoryTile({ category, width, onPress }: BroadCategoryTileProps) {
  const { style: bounceStyle, bounce } = useBounceAnimation(0.96);

  const handlePress = () => {
    // An impact, not `selectionAsync`: this leaves for another screen rather
    // than picking one of a set, which is the lighter tick Home's cravings use.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    bounce();
    onPress();
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={category.label}>
      <Animated.View style={bounceStyle}>
        <Tile width={width} testID="broad-category-tile">
          <Icon name={category.icon.name} sf={category.icon.sf} size={ICON_SIZE} color="brand" />
          <Label>
            <Text variant="labelSmall" numberOfLines={2}>
              {category.label}
            </Text>
          </Label>
        </Tile>
      </Animated.View>
    </Pressable>
  );
}

/**
 * "Comida e compras" — node 48:20267.
 *
 * The board draws six 120pt tiles three to a row, which only adds up on the
 * 430pt frame it was drawn at; on a 390pt phone three of them overflow and the
 * row breaks to two. The column is therefore derived from the window instead
 * of fixed, so the 3x2 composition the board intends survives every screen —
 * and a long label like "Supermercado" gets a second line rather than an
 * ellipsis.
 */
export function BroadCategoryGrid({
  categories,
  onSelect,
  horizontalInset = layout.screenPadding,
}: BroadCategoryGridProps) {
  const { width: windowWidth } = useWindowDimensions();
  const available = windowWidth - horizontalInset * 2 - TILE_GAP * (COLUMNS - 1);
  const tileWidth = Math.floor(available / COLUMNS);

  return (
    <Container>
      {categories.map((category) => (
        <BroadCategoryTile
          key={category.id}
          category={category}
          width={tileWidth}
          onPress={() => onSelect(category.id)}
        />
      ))}
    </Container>
  );
}
