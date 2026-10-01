import { Pressable } from 'react-native';
import { Icon } from '../Icon';
import { Container } from './StarRating.styles';

export type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  count?: number;
  size?: number;
  label?: string;
};

export function StarRating({ value, onChange, count = 5, size = 28, label = 'Avaliação' }: StarRatingProps) {
  return (
    <Container accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ min: 0, max: count, now: value }}>
      {Array.from({ length: count }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        return (
          <Pressable
            key={starValue}
            onPress={() => onChange(starValue)}
            accessibilityRole="button"
            accessibilityLabel={`${starValue} de ${count} estrelas`}
            hitSlop={4}
          >
            <Icon
              name={filled ? 'star' : 'star-outline'}
              sf={filled ? 'star.fill' : 'star'}
              size={size}
              color={filled ? 'warning' : 'border'}
            />
          </Pressable>
        );
      })}
    </Container>
  );
}
