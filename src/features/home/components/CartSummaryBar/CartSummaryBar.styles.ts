import styled from 'styled-components/native';
import { restaurantDetailPalette as palette } from '../../restaurantDetailPalette';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${palette.accent};
  shadow-color: #000000;
  shadow-offset: 0px ${({ theme }) => theme.elevation.level2.ios.shadowOffset.height}px;
  shadow-opacity: ${({ theme }) => theme.elevation.level2.ios.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.elevation.level2.ios.shadowRadius}px;
  elevation: ${({ theme }) => theme.elevation.level2.android.elevation};
`;

export const CountBadge = styled.View`
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  padding-horizontal: 4px;
  align-items: center;
  justify-content: center;
  background-color: ${palette.onAccent};
`;

export const CountText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${palette.accent};
`;

export const Label = styled.View`
  flex: 1;
`;

export const LabelText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${palette.onAccent};
`;

export const TotalText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${palette.onAccent};
`;
