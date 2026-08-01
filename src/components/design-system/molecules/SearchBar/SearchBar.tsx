import { TextField } from '@/components/design-system/atoms';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Buscar restaurantes' }: SearchBarProps) {
  return (
    <TextField
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessibilityLabel={placeholder}
      shape="pill"
      leadingIcon={{ name: 'search', sf: 'magnifyingglass' }}
    />
  );
}
