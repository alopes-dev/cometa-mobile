import styled from 'styled-components/native';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const ImageWrapper = styled.View`
  position: relative;
`;

export const RatingBadgeWrapper = styled.View`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm}px;
  right: ${({ theme }) => theme.spacing.sm}px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
