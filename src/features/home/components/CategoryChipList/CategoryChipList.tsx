import { ScrollView } from 'react-native';
import { Chip, Icon } from '@/components/design-system/atoms';
import { getCategoryIcon } from '../../categoryIcons';

export type CategoryChipListProps = {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryChipList({ categories, selected, onSelect }: CategoryChipListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
    >
      <Chip
        label="Tudo"
        selected={selected === null}
        onPress={() => onSelect(null)}
        icon={
          <Icon
            {...getCategoryIcon(null)}
            size={16}
            color={selected === null ? 'brandAccent' : 'brandChipText'}
          />
        }
      />
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          selected={selected === category}
          onPress={() => onSelect(category)}
          icon={
            <Icon
              {...getCategoryIcon(category)}
              size={16}
              color={selected === category ? 'brandAccent' : 'brandChipText'}
            />
          }
        />
      ))}
    </ScrollView>
  );
}
