import styled from 'styled-components/native';
import { textStyle } from '@/theme';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[16]}px;
`;

export const Thumbnail = styled.View`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;

export const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;

export const PriceText = styled.Text`
  ${textStyle('labelLarge')}
  color: ${({ theme }) => theme.colors.text.brand};
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`;
