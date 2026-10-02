import styled from 'styled-components/native';
import { textStyle } from '@/theme';

export const Container = styled.View<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[16]}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.brand.base};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export const TotalLabel = styled.Text`
  ${textStyle('labelSmall')}
  color: ${({ theme }) => theme.colors.text.onBrand};
  opacity: ${({ theme }) => theme.opacity[80]};
`;

export const TotalValue = styled.Text`
  ${textStyle('title')}
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

export const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const ButtonLabel = styled.Text`
  ${textStyle('bodyStrong')}
  color: ${({ theme }) => theme.colors.text.onBrand};
`;
