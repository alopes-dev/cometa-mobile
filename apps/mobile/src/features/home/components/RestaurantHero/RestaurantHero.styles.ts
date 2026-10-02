import styled from "styled-components/native";

export const TopBar = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => topInset + theme.spacing[8]}px;
  left: ${({ theme }) => theme.spacing[16]}px;
  right: ${({ theme }) => theme.spacing[16]}px;
  height: 36px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TopBarActions = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[8]}px;
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
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
`;

export const CompactTitleWrapper = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => topInset + theme.spacing[8]}px;
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
  padding: ${({ theme }) => theme.spacing[16]}px;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const RatedBadge = styled.View`
  align-self: flex-start;
  padding-horizontal: ${({ theme }) => theme.spacing[8]}px;
  padding-vertical: ${({ theme }) => theme.spacing[4]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
`;

