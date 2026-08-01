import { useTheme } from 'styled-components/native';
import { Icon } from '@/components/design-system/atoms';
import { Container, Field } from './SearchBar.styles';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Buscar restaurantes' }: SearchBarProps) {
  const theme = useTheme();

  return (
    <Container>
      <Icon name="search" sf="magnifyingglass" size={18} color="textSecondary" />
      <Field
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        accessibilityLabel={placeholder}
      />
    </Container>
  );
}
