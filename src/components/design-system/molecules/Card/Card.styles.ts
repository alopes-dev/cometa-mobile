import styled from 'styled-components/native';

export const Container = styled.View`
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md}px;
  shadow-color: #000000;
  shadow-offset: 0px ${({ theme }) => theme.elevation.level1.ios.shadowOffset.height}px;
  shadow-opacity: ${({ theme }) => theme.elevation.level1.ios.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.elevation.level1.ios.shadowRadius}px;
  elevation: ${({ theme }) => theme.elevation.level1.android.elevation};
`;
