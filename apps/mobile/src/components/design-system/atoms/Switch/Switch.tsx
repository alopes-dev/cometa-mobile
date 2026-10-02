import { Switch as RNSwitch } from 'react-native';
import { useTheme } from 'styled-components/native';

export type SwitchProps = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
};

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  const theme = useTheme();
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: theme.colors.border.default, true: theme.colors.brand.base }}
      thumbColor={theme.colors.background.primary}
      ios_backgroundColor={theme.colors.border.default}
      hitSlop={7}
    />
  );
}
