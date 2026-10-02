import styled from 'styled-components/native';
import { elevate, textStyle } from '@/theme';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[16]}px;
  padding-vertical: ${({ theme }) => theme.spacing[16]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[24]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.brand.base};
  ${elevate('md')}
`;

export const CountBadge = styled.View`
  min-width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing[6]}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.text.onBrand};
`;

export const CountText = styled.Text`
  ${textStyle('label')}
  color: ${({ theme }) => theme.colors.text.brand};
`;

export const Label = styled.View`
  flex: 1;
`;

export const LabelText = styled.Text`
  ${textStyle('labelLarge')}
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

export const TotalText = styled.Text`
  ${textStyle('labelLarge')}
  color: ${({ theme }) => theme.colors.text.onBrand};
`;
