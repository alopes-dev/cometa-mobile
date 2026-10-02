import styled from 'styled-components/native';
import { textStyle } from '@/theme';

export const Container = styled.View`
  width: 48%;
  gap: ${({ theme }) => theme.spacing[6]}px;
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
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brand.base};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background.primary};
`;

export const PriceText = styled.Text`
  ${textStyle('label')}
  color: ${({ theme }) => theme.colors.text.brand};
`;
