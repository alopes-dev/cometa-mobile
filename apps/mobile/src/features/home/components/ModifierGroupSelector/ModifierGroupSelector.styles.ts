import styled from 'styled-components/native';
import { radius } from '@/theme';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
  padding-vertical: ${({ theme }) => theme.spacing[8]}px;
`;

// Static shape only — background/border are animated per-option (see
// ModifierOptionRow), so they aren't part of these style objects.
export const circleShape = {
  width: 22,
  height: 22,
  borderRadius: radius.full,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const squareShape = {
  width: 22,
  height: 22,
  borderRadius: radius.xs,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
