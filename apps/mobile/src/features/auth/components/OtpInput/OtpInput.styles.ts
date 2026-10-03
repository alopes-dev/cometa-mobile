import { Text, TextInput } from 'react-native';
import styled from 'styled-components/native';

/** `OTP input` — node 74:24955. */
export const Row = styled.View`
  flex-direction: row;
  align-self: stretch;
  gap: ${({ theme }) => theme.auth.metrics.otpGap}px;
`;

/**
 * `Digit cell` — node 74:24956.
 *
 * The focused cell is drawn with a 2px green border and the rest with a 1px
 * subtle one. The width is `flex: 1` rather than fixed so six cells divide the
 * gutter evenly at any screen width.
 */
export const Cell = styled.View<{ focused: boolean; invalid: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => theme.auth.metrics.otpCellHeight}px;
  border-radius: ${({ theme }) => theme.auth.metrics.otpCellRadius}px;
  border-width: ${({ theme, focused }) =>
    focused ? theme.auth.metrics.otpFocusBorderWidth : theme.auth.metrics.fieldBorderWidth}px;
  border-color: ${({ theme, focused, invalid }) => {
    if (invalid) return theme.colors.border.error;
    return focused ? theme.auth.color.offerGreen : theme.auth.color.borderSubtle;
  }};
  background-color: ${({ theme }) => theme.auth.color.surfaceBackground};
`;

export const Digit = styled(Text)`
  font-family: ${({ theme }) => theme.auth.type.digit.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.digit.fontSize}px;
  color: ${({ theme }) => theme.auth.color.textPrimary};
`;

/**
 * The real input, held off-screen.
 *
 * One hidden field drives all six cells rather than six separate inputs: that
 * is what makes SMS autofill and paste land the whole code at once, which six
 * single-character fields cannot do.
 */
export const HiddenInput = styled(TextInput)`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

/** `Resend area` — node 74:24968. */
export const ResendArea = styled.View`
  align-self: stretch;
  align-items: center;
`;

export const ResendLabel = styled(Text)<{ actionable?: boolean }>`
  font-family: ${({ theme }) => theme.auth.type.resend.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.resend.fontSize}px;
  color: ${({ theme, actionable }) =>
    actionable ? theme.auth.color.offerGreen : theme.auth.color.textSecondary};
`;

/** `Hint` — node 74:24970, and the error that replaces it. */
export const Hint = styled(Text)<{ invalid?: boolean }>`
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.auth.type.legal.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.legal.fontSize}px;
  line-height: ${({ theme }) => theme.auth.type.legal.lineHeight}px;
  color: ${({ theme, invalid }) =>
    invalid ? theme.colors.text.error : theme.auth.color.textMuted};
`;
