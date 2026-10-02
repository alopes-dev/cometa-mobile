import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import type { SuggestedCategory } from '../../types';
import { Column, ICON_SIZE, Row, Tile } from './SuggestedCategoryGrid.styles';

export type SuggestedCategoryGridProps = {
  categories: SuggestedCategory[];
  onSelect: (category: SuggestedCategory) => void;
};

function SuggestedCategoryTile({
  category,
  onPress,
}: {
  category: SuggestedCategory;
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
        <Column>
          <Tile>
            <Icon name={category.icon.name} sf={category.icon.sf} size={ICON_SIZE} color="primary" />
          </Tile>
          <Text variant="micro" numberOfLines={1} style={{ textAlign: 'center' }}>
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
 * Four columns spread edge to edge, the way the board spaces them, rather
 * than a fixed gap: the tiles are a fixed 58pt and the row has to hold its
 * composition from a 390pt phone up to a 430pt one.
 */
export function SuggestedCategoryGrid({ categories, onSelect }: SuggestedCategoryGridProps) {
  return (
    <Row>
      {categories.map((category) => (
        <SuggestedCategoryTile
          key={category.id}
          category={category}
          onPress={() => onSelect(category)}
        />
      ))}
    </Row>
  );
}
