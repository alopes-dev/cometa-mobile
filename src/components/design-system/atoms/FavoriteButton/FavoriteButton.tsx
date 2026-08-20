import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { Icon } from '../Icon';
import { Container } from './FavoriteButton.styles';

export type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
};

export function FavoriteButton({ isFavorite, onToggle, size = 36 }: FavoriteButtonProps) {
  const { style: bounceStyle, bounce } = useBounceAnimation(1.15);

  const handleToggle = () => {
    bounce();
    onToggle();
  };

  return (
    <Pressable
      onPress={handleToggle}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: isFavorite }}
      hitSlop={8}
    >
      <Animated.View style={bounceStyle}>
        <Container size={size}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            sf={isFavorite ? 'heart.fill' : 'heart'}
            size={18}
            color={isFavorite ? 'error' : 'textSecondary'}
          />
        </Container>
      </Animated.View>
    </Pressable>
  );
}
