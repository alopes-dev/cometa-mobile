import { Pressable } from 'react-native';
import { Outer, Inner } from './Radio.styles';

export type RadioProps = {
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export function Radio({ selected = false, onPress, disabled = false }: RadioProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      hitSlop={11}
    >
      <Outer selected={selected} disabled={disabled}>
        {selected ? <Inner /> : null}
      </Outer>
    </Pressable>
  );
}
