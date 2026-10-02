import { Text, TextInput } from 'react-native';
import styled from 'styled-components/native';

/** `Input field` — node 44:22455. */
export const Block = styled.View`
  align-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.onboarding.metrics.fieldStackGap}px;
`;

export const Label = styled(Text)`
  font-family: ${({ theme }) => theme.onboarding.type.fieldLabel.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.fieldLabel.fontSize}px;
  color: ${({ theme }) => theme.onboarding.color.textSecondary};
`;

/**
 * `Field` — node 44:22457.
 *
 * Focus thickens the border from 1px to 1.5px and turns it green, which is how
 * the design marks the active field (the street field is drawn focused). The
 * box keeps its height across both states because the extra half-pixel is drawn
 * inward, so nothing below it shifts as focus moves down the form.
 */
export const Box = styled(TextInput)<{ focused: boolean }>`
  width: 100%;
  height: ${({ theme }) => theme.onboarding.metrics.fieldHeight}px;
  padding-horizontal: ${({ theme }) => theme.onboarding.metrics.fieldPaddingHorizontal}px;
  border-radius: ${({ theme }) => theme.onboarding.metrics.fieldRadius}px;
  border-curve: continuous;
  border-width: ${({ theme, focused }) =>
    focused
      ? theme.onboarding.metrics.fieldFocusBorderWidth
      : theme.onboarding.metrics.fieldBorderWidth}px;
  border-color: ${({ theme, focused }) =>
    focused ? theme.onboarding.color.offerGreen : theme.onboarding.color.borderSubtle};
  background-color: ${({ theme }) => theme.onboarding.color.surfaceBackground};
  font-family: ${({ theme }) => theme.onboarding.type.fieldValue.fontFamily};
  font-size: ${({ theme }) => theme.onboarding.type.fieldValue.fontSize}px;
  color: ${({ theme }) => theme.onboarding.color.textPrimary};
`;

/** `Address row` — node 44:22459, the side-by-side number and district pair. */
export const Row = styled.View`
  flex-direction: row;
  align-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.onboarding.metrics.formGap}px;
`;

export const RowItem = styled.View`
  flex: 1;
`;
