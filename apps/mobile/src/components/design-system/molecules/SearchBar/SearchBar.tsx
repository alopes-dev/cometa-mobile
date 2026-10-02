import { Pressable, View } from 'react-native';
import { Icon, TextField, type TextFieldProps } from '@/components/design-system/atoms';
import type { Theme } from '@/components/design-system/ThemeProvider';

/** The clear glyph the board draws inside the field (node 48:21786). */
const CLEAR_ICON_SIZE = 18;

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  backgroundColor?: keyof Theme['colors']['surface'];
  /** `pill` by default; Home's board draws a rounded rect instead (node 48:22537). */
  shape?: TextFieldProps['shape'];
  /** Row height; Home's board draws 52 (node 48:22537). */
  height?: TextFieldProps['height'];
  /** Raises the keyboard on mount — the Search board's focused field (node 48:20090). */
  autoFocus?: boolean;
  /** Runs the query the field holds. Wired to the return key, which reads "Pesquisar". */
  onSubmit?: (query: string) => void;
  /** Shows the clear button while there is something to clear. */
  onClear?: () => void;
  /**
   * Turns the bar into a doorway to the search screen: it stops accepting
   * input and the whole row becomes one target. This is what a feed's search
   * field is — the board gives searching a screen of its own, so typing in
   * place would filter a feed the design never filters.
   */
  onPress?: () => void;
  /** Spoken instead of the placeholder, when the placeholder is not the whole story. */
  accessibilityLabel?: string;
  clearAccessibilityLabel?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar restaurantes',
  backgroundColor,
  shape = 'pill',
  height,
  autoFocus,
  onSubmit,
  onClear,
  onPress,
  accessibilityLabel,
  clearAccessibilityLabel = 'Limpar',
}: SearchBarProps) {
  const label = accessibilityLabel ?? placeholder;

  const field = (
    <TextField
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessibilityLabel={label}
      shape={shape}
      height={height}
      autoFocus={autoFocus}
      editable={!onPress}
      returnKeyType="search"
      onSubmitEditing={() => onSubmit?.(value)}
      leadingIcon={{ name: 'search', sf: 'magnifyingglass' }}
      backgroundColor={backgroundColor}
      trailing={
        onClear && value.length > 0 ? (
          <Pressable
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel={clearAccessibilityLabel}
            hitSlop={12}
          >
            <Icon name="close-circle-outline" sf="xmark.circle" size={CLEAR_ICON_SIZE} color="muted" />
          </Pressable>
        ) : null
      }
    />
  );

  if (!onPress) return field;

  // The field inside is inert in both senses: it cannot be touched, and it is
  // hidden from the accessibility tree, so the row announces itself once — as
  // the button it now is, not as a text field that refuses to type.
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <View style={{ pointerEvents: 'none' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {field}
      </View>
    </Pressable>
  );
}
