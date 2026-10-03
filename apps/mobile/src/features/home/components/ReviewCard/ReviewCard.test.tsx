import { render } from '@testing-library/react-native';
import { ReviewCard } from './ReviewCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Review } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const review: Review = {
  id: 'r4-rev1',
  author: 'Mário',
  rating: 5,
  comment: 'Chegou quente e o molho é mesmo especial. Vou pedir outra vez.',
};

describe('ReviewCard', () => {
  it('attributes the review and shows what was written', () => {
    const { getByText } = renderWithTheme(<ReviewCard review={review} />);
    expect(getByText('Mário')).toBeTruthy();
    expect(getByText(review.comment)).toBeTruthy();
  });

  it('reads the stars out as a rating rather than as decoration', () => {
    const { getByLabelText } = renderWithTheme(<ReviewCard review={review} />);
    expect(getByLabelText('5 de 5 estrelas')).toBeTruthy();
  });

  it('reads a partial rating out with its own value', () => {
    const { getByLabelText } = renderWithTheme(<ReviewCard review={{ ...review, rating: 4 }} />);
    expect(getByLabelText('4 de 5 estrelas')).toBeTruthy();
  });
});
