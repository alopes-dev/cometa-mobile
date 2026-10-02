import styled from 'styled-components/native';

export const CARD_WIDTH = 260;
export const CARD_HEIGHT = 140;

export const Container = styled.View<{ fullWidth?: boolean }>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : `${CARD_WIDTH}px`)};
  height: ${({ fullWidth }) => (fullWidth ? 160 : CARD_HEIGHT)}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface.secondary};
`;

export const Badge = styled.View`
  align-self: flex-start;
  padding-horizontal: ${({ theme }) => theme.spacing[8]}px;
  padding-vertical: ${({ theme }) => theme.spacing[4]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.promo.offer.fill};
`;

export const Content = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.spacing[16]}px;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const TopContent = styled.View`
  position: absolute;
  top: ${({ theme }) => theme.spacing[8]}px;
  left: ${({ theme }) => theme.spacing[8]}px;
`;
