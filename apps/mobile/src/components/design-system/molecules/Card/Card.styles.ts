import styled from 'styled-components/native';
import { elevate } from '@/theme';

export const Container = styled.View`
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.surface.primary};
  padding: ${({ theme }) => theme.spacing[16]}px;
  ${elevate('sm')}
`;
