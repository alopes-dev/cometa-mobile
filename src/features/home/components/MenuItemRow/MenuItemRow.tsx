import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text, Icon } from '@/components/design-system/atoms';
import { formatKwanza } from '../../format';
import type { MenuItem } from '../../types';
import { AddButton, Container, Info, PriceText } from './MenuItemRow.styles';

export type MenuItemRowProps = {
  item: MenuItem;
  onAdd?: () => void;
};

export function MenuItemRow({ item, onAdd }: MenuItemRowProps) {
  return (
    <Container>
      <Info>
        <Text variant="bodyEmphasized">{item.name}</Text>
        <Text variant="footnote" color="textSecondary" numberOfLines={2}>
          {item.description}
        </Text>
        <PriceText>{formatKwanza(item.price)}</PriceText>
      </Info>
      {onAdd ? (
        <Pressable onPress={onAdd} accessibilityRole="button" accessibilityLabel={`Adicionar ${item.name}`} hitSlop={8}>
          <AddButton>
            <Icon name="add" sf="plus" size={16} color="onSecondary" />
          </AddButton>
        </Pressable>
      ) : null}
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 72, height: 72, borderRadius: 12 }}
        contentFit="cover"
      />
    </Container>
  );
}
