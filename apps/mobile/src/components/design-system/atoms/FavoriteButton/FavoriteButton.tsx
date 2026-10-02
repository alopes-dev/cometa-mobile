import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { Icon } from '../Icon';
import { Container, type FavoriteButtonVariant } from './FavoriteButton.styles';

export type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
  /** `floating` for use over media; `plain` on a solid surface. */
  variant?: FavoriteButtonVariant;
};

export function FavoriteButton({
  isFavorite,
  onToggle,
  size = 36,
  variant = 'plain',
}: FavoriteButtonProps) {
  const { style: bounceStyle, bounce } = useBounceAnimation(1.15);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
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
        <Container size={size} variant={variant}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            sf={isFavorite ? 'heart.fill' : 'heart'}
            size={18}
            color={isFavorite ? 'error' : 'secondary'}
          />
        </Container>
      </Animated.View>
    </Pressable>
  );
}
