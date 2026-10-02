import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[12]}px;
  padding: ${({ theme }) => theme.spacing[16]}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.brand.subtle};
  ${continuousCorners}
`;

export const Symbol = styled.View`
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.brand.base};
`;

export const Message = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;
