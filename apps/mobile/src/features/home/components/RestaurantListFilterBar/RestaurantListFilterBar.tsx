import { ScrollView } from 'react-native';
import { Chip } from '@/components/design-system/atoms';
import type { RestaurantSort } from '../../selectors';

export type RestaurantListFilterBarProps = {
  selected: RestaurantSort | null;
  onSelect: (sort: RestaurantSort | null) => void;
};

const FILTERS: { key: RestaurantSort; label: string }[] = [
  { key: 'fastest', label: 'Mais rápidos' },
  { key: 'topRated', label: 'Melhor avaliados' },
  { key: 'nearest', label: 'Mais próximos' },
  { key: 'lowestFee', label: 'Menor taxa' },
  { key: 'promotions', label: 'Promoções' },
];

export function RestaurantListFilterBar({ selected, onSelect }: RestaurantListFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
    >
      {FILTERS.map((filter) => (
        <Chip
          key={filter.key}
          label={filter.label}
          selected={selected === filter.key}
          onPress={() => onSelect(selected === filter.key ? null : filter.key)}
        />
      ))}
    </ScrollView>
  );
}
