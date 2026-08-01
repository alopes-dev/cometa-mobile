import styled from 'styled-components/native';

export const Container = styled.View`
  height: 340px;
  background-color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TopBar = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => topInset + theme.spacing.sm}px;
  left: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TopBarActions = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const IconButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

export const BottomContent = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const RatedBadge = styled.View`
  align-self: flex-start;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 4px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
