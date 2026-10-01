import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export const IconStack = styled.View`
  width: 140px;
  height: 140px;
  align-items: center;
  justify-content: center;
`;

export const Halo = styled.View`
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: ${({ theme }) => theme.colors.primary};
  opacity: ${({ theme }) => theme.opacity[10]};
`;

export const IconCircle = styled.View`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const TextGroup = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
`;

export const ButtonGroup = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;
