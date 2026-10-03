import { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { OnboardingIcon } from '@/features/onboarding/components/OnboardingIcon';
import { icon } from '../../assets';
import { country, phone as copy } from '../../content';
import { formatNationalPhone, normalizePhoneInput } from '../../validation';
import {
  Block,
  CountrySelector,
  DialCode,
  Field,
  Flag,
  Hint,
  Input,
  Label,
} from './PhoneField.styles';

export type PhoneFieldProps = {
  /** The national number, digits only. */
  value: string;
  onChangeText: (digits: string) => void;
  /** Shows the error border and message — frame "Phone · Invalid" (74:24827). */
  invalid?: boolean;
};

/**
 * The phone entry field — node 74:24720.
 *
 * State is held as bare digits and only *displayed* grouped, so the caller
 * validates one unambiguous form while the field still reads "923 456 789" as
 * the board draws it. `normalizePhoneInput` also absorbs a pasted `+244`,
 * which is the common way a number arrives from a contact card.
 *
 * The country selector is static: Angola is the only market, and the board
 * draws the chevron as an affordance for a picker that the flow does not yet
 * open. It is therefore not a button — presenting a control that does nothing
 * is worse than presenting none.
 */
export function PhoneField({ value, onChangeText, invalid = false }: PhoneFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <Block>
      <Label>{copy.label}</Label>
      <Field focused={focused} invalid={invalid}>
        <CountrySelector
          accessible
          accessibilityLabel={`${country.name}, ${country.dialCode}`}
        >
          <Flag>{country.flag}</Flag>
          <DialCode>{country.dialCode}</DialCode>
          <OnboardingIcon
            source={icon.chevronDown}
            size={theme.auth.metrics.countryChevronSize}
          />
        </CountrySelector>
        <Input
          value={formatNationalPhone(value)}
          onChangeText={(next) => onChangeText(normalizePhoneInput(next))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={copy.placeholder}
          placeholderTextColor={theme.auth.color.textMuted}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          accessibilityLabel={copy.label}
          returnKeyType="done"
        />
      </Field>
      <Hint invalid={invalid}>{invalid ? copy.invalid : copy.hint}</Hint>
    </Block>
  );
}
