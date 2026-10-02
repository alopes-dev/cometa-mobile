import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import { search } from '../../content';
import { ICON_SIZE, REMOVE_ICON_SIZE, Row, Term } from './SearchTermRow.styles';

export type SearchTermRowProps = {
  term: string;
  /** `recent` carries the history glyph and an x; `popular` carries the trend arrow. */
  kind: 'recent' | 'popular';
  onPress: (term: string) => void;
  /** Only a recent term can be forgotten (node 48:21792). */
  onRemove?: (term: string) => void;
};

/**
 * One term in "Pesquisas recentes" or "Populares" (nodes 48:20099, 48:20118).
 *
 * One component for both because the board draws one row with two leading
 * glyphs — a clock for what you searched, a rising arrow for what everyone
 * is searching — and nothing else between them changes.
 */
export function SearchTermRow({ term, kind, onPress, onRemove }: SearchTermRowProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress(term);
  };

  return (
    <Pressable onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button">
      <Animated.View style={pressStyle}>
        <Row>
          {kind === 'recent' ? (
            <Icon name="time-outline" sf="clock.arrow.circlepath" size={ICON_SIZE} color="muted" />
          ) : (
            <Icon name="trending-up-outline" sf="chart.line.uptrend.xyaxis" size={ICON_SIZE} color="brand" />
          )}
          <Term>
            <Text variant="bodySmall" numberOfLines={1}>
              {term}
            </Text>
          </Term>
          {onRemove ? (
            <Pressable
              onPress={() => onRemove(term)}
              accessibilityRole="button"
              accessibilityLabel={search.removeRecent(term)}
              // The glyph is 15pt; the slop is what makes it a 44pt target
              // without opening a gap between the rows the board stacks.
              hitSlop={14}
            >
              <Icon name="close-outline" sf="xmark" size={REMOVE_ICON_SIZE} color="muted" />
            </Pressable>
          ) : null}
        </Row>
      </Animated.View>
    </Pressable>
  );
}
