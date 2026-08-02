import styled from 'styled-components/native';

export const CARD_WIDTH = 260;
export const CARD_HEIGHT = 140;

export const Container = styled.View`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.brandChipBackground};
`;

export const Badge = styled.View`
  align-self: flex-start;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 4px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.promoBadgeBackground};
`;

export const Content = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: 4px;
`;

export const TopContent = styled.View`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm}px;
  left: ${({ theme }) => theme.spacing.sm}px;
`;
