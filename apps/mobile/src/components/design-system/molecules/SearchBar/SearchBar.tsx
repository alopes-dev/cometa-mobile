import { TextField, type TextFieldProps } from '@/components/design-system/atoms';
import type { Theme } from '@/components/design-system/ThemeProvider';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  backgroundColor?: keyof Theme['colors']['surface'];
  /** `pill` by default; Home's board draws a rounded rect instead (node 48:22537). */
  shape?: TextFieldProps['shape'];
  /** Row height; Home's board draws 52 (node 48:22537). */
  height?: TextFieldProps['height'];
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar restaurantes',
  backgroundColor,
  shape = 'pill',
  height,
}: SearchBarProps) {
  return (
    <TextField
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessibilityLabel={placeholder}
      shape={shape}
      height={height}
      leadingIcon={{ name: 'search', sf: 'magnifyingglass' }}
      backgroundColor={backgroundColor}
    />
  );
}
