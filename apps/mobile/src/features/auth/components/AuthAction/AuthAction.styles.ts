import { Text } from 'react-native';
import styled from 'styled-components/native';

export type AuthActionVariant = 'primary' | 'secondary';

/**
 * `Button` — nodes 74:24642 (primary), 74:24644 (secondary) and 74:24728
 * (the disabled primary).
 *
 * Disabled is its own fill rather than the primary fill at reduced opacity:
 * the board draws it `border/subtle` with a `text/muted` label, which a
 * blanket opacity would not reproduce.
 */
export const Surface = styled.View<{ variant: AuthActionVariant; disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  height: ${({ theme }) => theme.auth.metrics.actionHeight}px;
  padding-horizontal: 20px;
  border-radius: ${({ theme }) => theme.auth.metrics.actionRadius}px;
  border-width: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.auth.metrics.fieldBorderWidth : 0}px;
  border-color: ${({ theme }) => theme.auth.color.borderSubtle};
  background-color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.auth.color.borderSubtle;
    return variant === 'primary' ? theme.auth.color.offerGreen : theme.auth.color.surfaceBackground;
  }};
`;

export const Label = styled(Text)<{ variant: AuthActionVariant; disabled: boolean }>`
  font-family: ${({ theme }) => theme.auth.type.action.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.action.fontSize}px;
  color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.auth.color.textMuted;
    return variant === 'primary'
      ? theme.auth.color.surfaceBackground
      : theme.auth.color.textPrimary;
  }};
`;
