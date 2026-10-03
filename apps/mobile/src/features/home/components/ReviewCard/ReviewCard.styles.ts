import styled from 'styled-components/native';
import { boardTextStyle, continuousCorners } from '@/theme';

/** `Review` — node 48:20689. */
export const Container = styled.View`
  gap: ${({ theme }) => theme.business.metrics.reviewGap}px;
  padding: ${({ theme }) => theme.business.metrics.reviewPadding}px;
  border-radius: ${({ theme }) => theme.business.metrics.reviewRadius}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  ${continuousCorners}
`;

/** `Autor` — node 48:20690, where the board writes "Mário · ★★★★★". */
export const Attribution = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.business.metrics.reviewGap}px;
`;

export const Author = styled.Text`
  ${boardTextStyle('reviewAuthor')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Stars = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;

export const Comment = styled.Text`
  ${boardTextStyle('reviewComment')}
  color: ${({ theme }) => theme.colors.text.secondary};
`;
