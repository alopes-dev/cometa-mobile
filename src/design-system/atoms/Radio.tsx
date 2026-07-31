import { Pressable } from 'react-native';
import styled from 'styled-components/native';

export type RadioProps = {
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

const Outer = styled.View<{ selected: boolean; disabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

const Inner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

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
