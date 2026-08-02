import { Pressable } from 'react-native';
import { Icon } from '../Icon';
import { Container } from './FavoriteButton.styles';

export type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
};

export function FavoriteButton({ isFavorite, onToggle, size = 36 }: FavoriteButtonProps) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: isFavorite }}
      hitSlop={8}
    >
      <Container size={size}>
        <Icon
          name={isFavorite ? 'heart' : 'heart-outline'}
          sf={isFavorite ? 'heart.fill' : 'heart'}
          size={18}
          color={isFavorite ? 'error' : 'textSecondary'}
        />
      </Container>
    </Pressable>
  );
}
