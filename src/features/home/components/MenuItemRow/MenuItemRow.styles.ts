import styled from 'styled-components/native';
import { restaurantDetailPalette as palette } from '../../restaurantDetailPalette';

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: 4px;
`;

export const AddButton = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${palette.accent};
`;

export const PriceText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${palette.accent};
`;
