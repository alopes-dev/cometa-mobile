import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text, Icon } from '@/components/design-system/atoms';
import { formatKwanza } from '../../format';
import type { MenuItem } from '../../types';
import { AddButton, Container, ImageWrapper, PriceText } from './MenuGridCard.styles';

export type MenuGridCardProps = {
  item: MenuItem;
  onAdd?: () => void;
};

export function MenuGridCard({ item, onAdd }: MenuGridCardProps) {
  return (
    <Container>
      <ImageWrapper>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: 120, borderRadius: 12 }}
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
              <Icon name="add" sf="plus" size={14} color="onSecondary" />
            </AddButton>
          </Pressable>
        ) : null}
      </ImageWrapper>
      <Text variant="footnote" numberOfLines={1}>
        {item.name}
      </Text>
      <Text variant="caption" color="textSecondary" numberOfLines={1}>
        {item.description}
      </Text>
      <PriceText>{formatKwanza(item.price)}</PriceText>
    </Container>
  );
}
