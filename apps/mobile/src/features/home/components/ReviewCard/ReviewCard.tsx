import { useTheme } from 'styled-components/native';
import { Icon } from '@/components/design-system/atoms';
import type { Review } from '../../types';
import { Attribution, Author, Comment, Container, Stars } from './ReviewCard.styles';

const STAR_COUNT = 5;

export type ReviewCardProps = {
  review: Review;
};

/**
 * One customer review — node 48:20689.
 *
 * The board draws the stars as text ("Mário · ★★★★★"); they are drawn as
 * icons here and the row carries the rating as its accessibility label, so a
 * screen reader hears "4 de 5 estrelas" instead of five identical glyphs.
 */
export function ReviewCard({ review }: ReviewCardProps) {
  const theme = useTheme();

  return (
    <Container>
      <Attribution>
        <Author>{review.author}</Author>
        <Stars
          accessible
          accessibilityRole="image"
          accessibilityLabel={`${review.rating} de ${STAR_COUNT} estrelas`}
        >
          {Array.from({ length: STAR_COUNT }, (_, index) => {
            const filled = index < review.rating;
            return (
              <Icon
                key={index}
                name={filled ? 'star' : 'star-outline'}
                sf={filled ? 'star.fill' : 'star'}
                size={theme.business.metrics.reviewStarSize}
                color={filled ? 'rating' : 'ratingEmpty'}
              />
            );
          })}
        </Stars>
      </Attribution>
      <Comment>{review.comment}</Comment>
    </Container>
  );
}
