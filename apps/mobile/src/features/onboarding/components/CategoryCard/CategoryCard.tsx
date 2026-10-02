import { Pressable } from 'react-native';
import { useTheme } from 'styled-components/native';
import { categoryIcon } from '../../assets';
import type { CategoryContent } from '../../content';
import { OnboardingIcon } from '../OnboardingIcon';
import { Tile, Label } from './CategoryCard.styles';

export { Grid } from './CategoryCard.styles';

export type CategoryCardProps = {
  category: CategoryContent;
  selected: boolean;
  onToggle: (id: string) => void;
};

/**
 * One tile of the taste grid — node 44:22534 and its seven siblings.
 *
 * The exported glyphs carry the design's colour baked in — Figma drew four
 * tiles selected and four not — so selection is expressed with `tintColor`
 * rather than by swapping files. Note that the design tints the icon and the
 * label differently when idle (`text/secondary` against `text/primary`); both
 * are reproduced as drawn.
 *
 * Exposed as a checkbox, not a button: these toggle and several can be on at
 * once, which is what tells a screen reader the choice is multi-select.
 */
export function CategoryCard({ category, selected, onToggle }: CategoryCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onToggle(category.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={category.label}
      // The flex sizing lives on the tile; the pressable inherits it so the
      // whole card is the hit target rather than just its contents.
      style={({ pressed }) => ({
        flexGrow: 1,
        flexBasis: '45%',
        opacity: pressed ? theme.pressed.opacity : 1,
      })}
    >
      <Tile selected={selected}>
        <OnboardingIcon
          source={categoryIcon[category.icon]}
          size={theme.onboarding.metrics.categoryIconSize}
          tintColor={
            selected ? theme.onboarding.color.offerGreen : theme.onboarding.color.textSecondary
          }
        />
        <Label selected={selected}>{category.label}</Label>
      </Tile>
    </Pressable>
  );
}
