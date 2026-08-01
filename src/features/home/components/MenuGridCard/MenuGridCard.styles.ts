import styled from 'styled-components/native';
import { restaurantDetailPalette as palette } from '../../restaurantDetailPalette';

export const Container = styled.View`
  width: 48%;
  gap: 4px;
`;

export const ImageWrapper = styled.View`
  position: relative;
`;

export const AddButton = styled.View`
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${palette.accent};
  border-width: 2px;
  border-color: ${palette.background};
`;

export const PriceText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${palette.accent};
`;
