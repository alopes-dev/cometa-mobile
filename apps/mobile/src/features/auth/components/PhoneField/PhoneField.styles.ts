import { Text, TextInput } from 'react-native';
import styled from 'styled-components/native';

/** `Phone input` — node 74:24718. */
export const Block = styled.View`
  align-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.auth.metrics.fieldStackGap}px;
`;

export const Label = styled(Text)`
  font-family: ${({ theme }) => theme.auth.type.fieldLabel.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.fieldLabel.fontSize}px;
  color: ${({ theme }) => theme.auth.color.textSecondary};
`;

/**
 * `Phone field` — node 74:24720.
 *
 * The border turns green on focus and red once a complete-but-invalid number
 * has been entered, which is how frames "Phone · Typing" (74:24735) and
 * "Phone · Invalid" (74:24827) differ from the resting state.
 */
export const Field = styled.View<{ focused: boolean; invalid: boolean }>`
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  overflow: hidden;
  height: ${({ theme }) => theme.auth.metrics.fieldHeight}px;
  border-radius: ${({ theme }) => theme.auth.metrics.fieldRadius}px;
  border-width: ${({ theme }) => theme.auth.metrics.fieldBorderWidth}px;
  border-color: ${({ theme, focused, invalid }) => {
    if (invalid) return theme.colors.border.error;
    return focused ? theme.auth.color.offerGreen : theme.auth.color.borderSubtle;
  }};
  background-color: ${({ theme }) => theme.auth.color.surfaceBackground};
`;

/** `Country selector` — node 74:24721. */
export const CountrySelector = styled.View`
  flex-direction: row;
  align-items: center;
  height: 100%;
  gap: ${({ theme }) => theme.auth.metrics.countryGap}px;
  padding-horizontal: ${({ theme }) => theme.auth.metrics.fieldPaddingHorizontal}px;
  border-right-width: ${({ theme }) => theme.auth.metrics.fieldBorderWidth}px;
  border-right-color: ${({ theme }) => theme.auth.color.borderSubtle};
`;

export const Flag = styled(Text)`
  font-family: ${({ theme }) => theme.auth.type.countryFlag.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.countryFlag.fontSize}px;
`;

export const DialCode = styled(Text)`
  font-family: ${({ theme }) => theme.auth.type.countryCode.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.countryCode.fontSize}px;
  color: ${({ theme }) => theme.auth.color.textPrimary};
`;

export const Input = styled(TextInput)`
  flex: 1;
  height: 100%;
  padding-horizontal: ${({ theme }) => theme.auth.metrics.fieldPaddingHorizontal}px;
  font-family: ${({ theme }) => theme.auth.type.fieldValue.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.fieldValue.fontSize}px;
  color: ${({ theme }) => theme.auth.color.textPrimary};
`;

/** `Hint` — node 74:24726, and the invalid message that replaces it. */
export const Hint = styled(Text)<{ invalid?: boolean }>`
  width: 100%;
  font-family: ${({ theme }) => theme.auth.type.hint.fontFamily};
  font-size: ${({ theme }) => theme.auth.type.hint.fontSize}px;
  line-height: ${({ theme }) => theme.auth.type.hint.lineHeight}px;
  color: ${({ theme, invalid }) =>
    invalid ? theme.colors.text.error : theme.auth.color.textMuted};
`;
