import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { Icon } from './Icon';

export type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const Box = styled.View<{ checked: boolean; disabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, checked }) => (checked ? theme.colors.primary : 'transparent')};
  border-width: 1px;
  border-color: ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.border)};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export function Checkbox({ checked = false, onChange, disabled = false }: CheckboxProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : () => onChange?.(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      hitSlop={11}
    >
      <Box checked={checked} disabled={disabled}>
        {checked ? <Icon name="checkmark" size={16} color="onPrimary" /> : null}
      </Box>
    </Pressable>
  );
}
