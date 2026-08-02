import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.brandAccent};
  shadow-color: #000000;
  shadow-offset: 0px ${({ theme }) => theme.elevation.level2.ios.shadowOffset.height}px;
  shadow-opacity: ${({ theme }) => theme.elevation.level2.ios.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.elevation.level2.ios.shadowRadius}px;
  elevation: ${({ theme }) => theme.elevation.level2.android.elevation};
`;

export const CountBadge = styled.View`
  min-width: 28px;
  height: 28px;
  border-radius: 14px;
  padding-horizontal: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brandOnAccent};
`;

export const CountText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandAccent};
`;

export const Label = styled.View`
  flex: 1;
`;

export const LabelText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brandOnAccent};
`;

export const TotalText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brandOnAccent};
`;
