import { Image } from 'expo-image';
import styled from 'styled-components/native';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing[8]}px;
  padding: ${({ theme }) => theme.spacing[16]}px;
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[16]}px;
`;

export const Photo = styled(Image)`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.full}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;

export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[8]}px;
`;

export const ActionButton = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]}px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;
