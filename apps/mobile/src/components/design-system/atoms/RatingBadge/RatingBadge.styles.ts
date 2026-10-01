import styled, { css } from 'styled-components/native';

export const Container = styled.View<{ variant: 'floating' | 'plain' }>`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  ${({ theme, variant }) =>
    variant === 'floating'
      ? css`
          padding-horizontal: ${theme.spacing.sm}px;
          padding-vertical: 4px;
          border-radius: ${theme.radius.pill}px;
          background-color: rgba(255, 255, 255, 0.92);
          shadow-color: #000000;
          shadow-offset: 0px 1px;
          shadow-opacity: 0.12;
          shadow-radius: 3px;
          elevation: 2;
        `
      : ''}
`;
