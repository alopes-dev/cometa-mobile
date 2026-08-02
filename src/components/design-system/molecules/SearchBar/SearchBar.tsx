import { TextField } from '@/components/design-system/atoms';
import type { Theme } from '@/components/design-system/ThemeProvider';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  backgroundColor?: keyof Theme['colors'];
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar restaurantes',
  backgroundColor,
}: SearchBarProps) {
  return (
    <TextField
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessibilityLabel={placeholder}
      shape="pill"
      leadingIcon={{ name: 'search', sf: 'magnifyingglass' }}
      backgroundColor={backgroundColor}
    />
  );
}
