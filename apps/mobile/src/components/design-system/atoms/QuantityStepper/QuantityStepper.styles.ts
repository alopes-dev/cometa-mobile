import styled from 'styled-components/native';
import { textStyle } from '@/theme';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
  background-color: ${({ theme }) => theme.colors.brand.subtle};
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding: ${({ theme }) => theme.spacing[4]}px;
`;

export const StepButton = styled.View<{ variant: 'decrement' | 'increment' }>`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant }) =>
    variant === 'increment' ? theme.colors.brand.base : theme.colors.surface.primary};
`;

export const Value = styled.Text`
  min-width: 20px;
  text-align: center;
  ${textStyle('bodyStrong')}
  color: ${({ theme }) => theme.colors.text.primary};
`;
