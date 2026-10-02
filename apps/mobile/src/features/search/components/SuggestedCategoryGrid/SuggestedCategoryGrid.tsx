import { Pressable, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { layout } from '@/theme';
import type { SuggestedCategory } from '../../types';
import { COLUMNS, Column, ICON_SIZE, Row, Tile } from './SuggestedCategoryGrid.styles';

export type SuggestedCategoryGridProps = {
  categories: SuggestedCategory[];
  onSelect: (category: SuggestedCategory) => void;
  /** Padding between the grid and each screen edge; used to size the columns. */
  horizontalInset?: number;
};

function SuggestedCategoryTile({
  category,
  width,
  onPress,
}: {
  category: SuggestedCategory;
  width: number;
  onPress: () => void;
}) {
  const { style: bounceStyle, bounce } = useBounceAnimation(0.94);

  const handlePress = () => {
    // Picking one of a set, so the lighter selection tick rather than an
    // impact: this fills the field in place instead of leaving for a screen.
    Haptics.selectionAsync().catch(() => {});
    bounce();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={category.label}
      testID={`suggested-category-${category.id}`}
    >
      <Animated.View style={bounceStyle}>
        <Column width={width}>
          <Tile>
            <Icon name={category.icon.name} sf={category.icon.sf} size={ICON_SIZE} color="primary" />
          </Tile>
          <Text variant="micro" numberOfLines={2} style={{ textAlign: 'center' }}>
            {category.label}
          </Text>
        </Column>
      </Animated.View>
    </Pressable>
  );
}

/**
 * "Categorias sugeridas" — node 48:20136.
 *
 * The column is derived from the window rather than fixed at the board's
 * 68pt, the same call `BroadCategoryGrid` makes and for the same reason: at
 * 68pt the widest label — "Hambúrguer" — has nowhere to go but an ellipsis,
 * because the ramp's smallest step is 12 and the board sets these at 10. Four
 * equal columns across the content width keep the composition the board drew
 * on every screen size and give the word room to set.
 */
export function SuggestedCategoryGrid({
  categories,
  onSelect,
  horizontalInset = layout.screenPadding,
}: SuggestedCategoryGridProps) {
  const { width: windowWidth } = useWindowDimensions();
  const columnWidth = Math.floor((windowWidth - horizontalInset * 2) / COLUMNS);

  return (
    <Row>
      {categories.map((category) => (
        <SuggestedCategoryTile
          key={category.id}
          category={category}
          width={columnWidth}
          onPress={() => onSelect(category)}
        />
      ))}
    </Row>
  );
}
