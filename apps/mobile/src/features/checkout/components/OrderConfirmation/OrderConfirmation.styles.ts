import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[24]}px;
  padding: ${({ theme }) => theme.spacing[32]}px;
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
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.brand.base};
  opacity: ${({ theme }) => theme.opacity[10]};
`;

export const IconCircle = styled.View`
  width: 88px;
  height: 88px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brand.base};
`;

export const TextGroup = styled.View`
  gap: ${({ theme }) => theme.spacing[4]}px;
  align-items: center;
`;

export const ButtonGroup = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing[8]}px;
`;
