import styled from 'styled-components/native';
import { withAlpha } from '../Chip/Chip.styles';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => withAlpha(theme.colors.primary, '14')};
  border-radius: ${({ theme }) => theme.radius.pill}px;
  padding: 4px;
`;

export const StepButton = styled.View<{ variant: 'decrement' | 'increment' }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant }) =>
    variant === 'increment' ? theme.colors.primary : theme.colors.background};
`;

export const Value = styled.Text`
  min-width: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
