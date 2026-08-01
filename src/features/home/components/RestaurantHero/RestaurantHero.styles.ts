import styled from 'styled-components/native';

export const TopBar = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => topInset + theme.spacing.sm}px;
  left: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  height: 36px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TopBarActions = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const IconButtonStack = styled.View`
  width: 36px;
  height: 36px;
`;

export const IconButton = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

export const CompactTitleWrapper = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => topInset + theme.spacing.sm}px;
  left: 56px;
  right: 96px;
  height: 36px;
  align-items: center;
  justify-content: center;
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
