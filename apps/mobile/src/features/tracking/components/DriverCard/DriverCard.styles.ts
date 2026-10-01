import { Image } from 'expo-image';
import styled from 'styled-components/native';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const Photo = styled(Image)`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const Info = styled.View`
  flex: 1;
  gap: 2px;
`;

export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const ActionButton = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.background};
`;
