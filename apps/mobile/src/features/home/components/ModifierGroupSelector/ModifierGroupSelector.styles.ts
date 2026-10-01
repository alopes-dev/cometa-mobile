import styled from 'styled-components/native';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

// Static shape only — background/border are animated per-option (see
// ModifierOptionRow), so they aren't part of these style objects.
export const circleShape = {
  width: 22,
  height: 22,
  borderRadius: 11,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const squareShape = {
  width: 22,
  height: 22,
  borderRadius: 4,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
