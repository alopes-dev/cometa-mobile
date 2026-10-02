import styled, { css } from 'styled-components/native';
import { elevate } from '@/theme';

export const Container = styled.View<{ variant: 'floating' | 'plain' }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
  ${({ theme, variant }) =>
    variant === 'floating'
      ? css`
          padding-horizontal: ${theme.spacing[8]}px;
          padding-vertical: ${({ theme }) => theme.spacing[4]}px;
          border-radius: ${theme.radius.full}px;
          background-color: ${theme.colors.overlay.floating};
          ${elevate('sm')}
        `
      : ''}
`;
