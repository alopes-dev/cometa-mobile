import styled from 'styled-components/native';
import { boardTextStyle, continuousCorners } from '@/theme';

/** `Perfil` — node 48:20613. */
export const Container = styled.View`
  gap: ${({ theme }) => theme.business.metrics.profileGap}px;
  padding-horizontal: ${({ theme }) => theme.business.metrics.profilePadding}px;
  padding-top: ${({ theme }) => theme.business.metrics.profilePaddingTop}px;
  padding-bottom: ${({ theme }) => theme.business.metrics.profilePaddingBottom}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

/** `Identidade` — node 48:20614. */
export const Identity = styled.View`
  gap: ${({ theme }) => theme.business.metrics.identityGap}px;
`;

export const Name = styled.Text`
  ${boardTextStyle('name')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Placing = styled.Text`
  ${boardTextStyle('placing')}
  color: ${({ theme }) => theme.colors.text.secondary};
`;

/** `Rating` — node 48:20617. */
export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.business.metrics.ratingGap}px;
`;

export const RatingValue = styled.Text`
  ${boardTextStyle('ratingValue')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ReviewCount = styled.Text`
  ${boardTextStyle('reviewCount')}
  color: ${({ theme }) => theme.colors.text.muted};
`;

/** `Dados de entrega` — node 48:20621. */
export const DeliveryStrip = styled.View`
  flex-direction: row;
  border-radius: ${({ theme }) => theme.business.metrics.stripRadius}px;
  padding-vertical: ${({ theme }) => theme.business.metrics.stripPaddingVertical}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  ${continuousCorners}
`;

/** One `Informação` cell — nodes 48:20622, 48:20625, 48:20628. */
export const DeliveryFact = styled.View`
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.business.metrics.factGap}px;
`;

export const DeliveryFactLabel = styled.Text`
  ${boardTextStyle('deliveryFact')}
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

export const Description = styled.Text`
  ${boardTextStyle('description')}
  color: ${({ theme }) => theme.colors.text.secondary};
`;
