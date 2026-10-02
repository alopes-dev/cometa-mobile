import { ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Chip } from '@/components/design-system/atoms';
import { spacing } from '@/theme';
import { search } from '../../content';
import type { SearchScope } from '../../types';

export type SearchScopeTabsProps = {
  selected: SearchScope;
  onSelect: (scope: SearchScope) => void;
  /** Padding between the row and each screen edge. */
  horizontalInset: number;
};

/** In the board's order (node 48:20176). */
const SCOPES: { key: SearchScope; label: string }[] = [
  { key: 'all', label: search.scopes.all },
  { key: 'restaurants', label: search.scopes.restaurants },
  { key: 'products', label: search.scopes.products },
  { key: 'offers', label: search.scopes.offers },
];

/**
 * What the query is looking for — node 48:20176.
 *
 * Single-select and never empty, unlike the filters below: a scope always has
 * an answer, and "Tudo" is it until the customer says otherwise. Tapping the
 * selected tab therefore does nothing rather than clearing it.
 */
export function SearchScopeTabs({ selected, onSelect, horizontalInset }: SearchScopeTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing[8], paddingHorizontal: horizontalInset }}
    >
      {SCOPES.map((scope) => (
        <Chip
          key={scope.key}
          label={scope.label}
          selected={selected === scope.key}
          size="sm"
          variant="outlined"
          onPress={() => {
            if (selected === scope.key) return;
            Haptics.selectionAsync().catch(() => {});
            onSelect(scope.key);
          }}
        />
      ))}
    </ScrollView>
  );
}
