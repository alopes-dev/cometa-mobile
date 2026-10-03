import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { OTP_LENGTH, focusedOtpIndex, normalizeOtpInput } from '../../validation';
import { Cell, Digit, HiddenInput, Row } from './OtpInput.styles';

export type OtpInputProps = {
  value: string;
  onChangeText: (digits: string) => void;
  /** Paints every cell's border red — frame "OTP · Código incorreto" (74:25091). */
  invalid?: boolean;
  /** Blocks edits while the code is being checked, or after too many attempts. */
  editable?: boolean;
  autoFocus?: boolean;
};

/**
 * The six-cell code entry — node 74:24955.
 *
 * The cells are presentation; a single hidden `TextInput` behind them holds the
 * value. That is deliberate and is what delivers the three behaviours the board
 * calls out in node 74:24970 — "SMS autofill, colar código e avanço automático":
 * iOS hands a whole autofilled code to one field, a paste arrives as one change,
 * and "auto advance" is then just the focused cell moving as the string grows,
 * with no per-cell focus juggling and no backspace that strands the caret.
 */
export function OtpInput({
  value,
  onChangeText,
  invalid = false,
  editable = true,
  autoFocus = false,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = normalizeOtpInput(value);
  const caret = focusedOtpIndex(digits);

  return (
    <View style={{ alignSelf: 'stretch' }}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        accessibilityRole="button"
        accessibilityLabel="Código de verificação"
        accessibilityValue={{ text: `${digits.length} de ${OTP_LENGTH} dígitos` }}
      >
        <Row>
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <Cell
              key={index}
              focused={editable && index === caret && digits.length < OTP_LENGTH}
              invalid={invalid}
            >
              <Digit>{digits[index] ?? ''}</Digit>
            </Cell>
          ))}
        </Row>
      </Pressable>
      <HiddenInput
        ref={inputRef}
        value={digits}
        onChangeText={(next) => onChangeText(normalizeOtpInput(next))}
        editable={editable}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        // Both are needed: iOS reads the code from the SMS via `oneTimeCode`,
        // Android via the `sms-otp` autocomplete hint.
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={OTP_LENGTH}
        // The cells above are the visible affordance; this field must not be
        // reachable on its own or assistive tech announces the same thing twice.
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
}
