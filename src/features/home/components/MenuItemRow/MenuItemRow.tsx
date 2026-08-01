import { Image } from 'expo-image';
import { Text } from '@/components/design-system/atoms';
import { formatKwanza } from '../../format';
import type { MenuItem } from '../../types';
import { Container, Info } from './MenuItemRow.styles';

export type MenuItemRowProps = {
  item: MenuItem;
};

export function MenuItemRow({ item }: MenuItemRowProps) {
  return (
    <Container>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 64, height: 64, borderRadius: 8 }}
        contentFit="cover"
      />
      <Info>
        <Text variant="bodyEmphasized">{item.name}</Text>
        <Text variant="footnote" color="textSecondary" numberOfLines={2}>
          {item.description}
        </Text>
        <Text variant="footnote" color="primary">
          {formatKwanza(item.price)}
        </Text>
      </Info>
    </Container>
  );
}
