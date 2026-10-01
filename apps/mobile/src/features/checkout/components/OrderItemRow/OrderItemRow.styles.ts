import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const Thumbnail = styled.View`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;

export const Info = styled.View`
  flex: 1;
  gap: 2px;
`;

export const PriceText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 2px;
`;
