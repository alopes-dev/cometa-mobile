import { ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Chip, Icon } from '@/components/design-system/atoms';
import { spacing } from '@/theme';
import { search } from '../../content';
import type { SearchQuickFilter } from '../../types';

/** Node 48:21858. */
const FILTERS_ICON_SIZE = 14;

export type SearchFilterBarProps = {
  selected: ReadonlySet<SearchQuickFilter>;
  onToggle: (filter: SearchQuickFilter) => void;
  /** Opens the full filter sheet. */
  onPressFilters: () => void;
  /** Padding between the row and each screen edge. */
  horizontalInset: number;
};

/** In the board's order (node 48:20185). */
const QUICK_FILTERS: { key: SearchQuickFilter; label: string }[] = [
  { key: 'fastest', label: search.fastest },
  { key: 'highlyRated', label: search.highlyRated },
];

/**
 * The quick filters — node 48:20185.
 *
 * Multi-select, and each one toggles off again: these narrow a result set the
 * customer is already looking at, so every one of them has to be undoable
 * without leaving the screen.
 *
 * "Filtros" is not one of them. It is the doorway to the full sheet, which is
 * why it leads with the sliders glyph and never takes the selected state.
 */
export function SearchFilterBar({
  selected,
  onToggle,
  onPressFilters,
  horizontalInset,
}: SearchFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing[8], paddingHorizontal: horizontalInset }}
    >
      <Chip
        label={search.filters}
        size="sm"
        variant="outlined"
        icon={
          <Icon
            name="options-outline"
            sf="slider.horizontal.3"
            size={FILTERS_ICON_SIZE}
            color="primary"
          />
        }
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPressFilters();
        }}
      />
      {QUICK_FILTERS.map((filter) => (
        <Chip
          key={filter.key}
          label={filter.label}
          selected={selected.has(filter.key)}
          size="sm"
          variant="outlined"
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onToggle(filter.key);
          }}
        />
      ))}
    </ScrollView>
  );
}
