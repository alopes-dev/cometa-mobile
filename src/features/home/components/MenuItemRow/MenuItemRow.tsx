import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text, Icon } from '@/components/design-system/atoms';
import { formatKwanza } from '../../format';
import type { MenuItem } from '../../types';
import { AddButton, Container, ImageWrapper, Info } from './MenuItemRow.styles';

export type MenuItemRowProps = {
  item: MenuItem;
  onAdd?: () => void;
};

export function MenuItemRow({ item, onAdd }: MenuItemRowProps) {
  return (
    <Container>
      <ImageWrapper>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 64, height: 64, borderRadius: 8 }}
          contentFit="cover"
        />
        {onAdd ? (
          <Pressable
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={`Adicionar ${item.name}`}
            hitSlop={8}
          >
            <AddButton>
              <Icon name="add" sf="plus" size={14} color="onPrimary" />
            </AddButton>
          </Pressable>
        ) : null}
      </ImageWrapper>
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
