import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@/design-system/ThemeProvider';

type ColorKey = keyof Theme['colors'];

export type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  sf?: SFSymbol;
  size?: number;
  color?: ColorKey;
};

export function Icon({ name, sf, size = 24, color = 'textPrimary' }: IconProps) {
  const theme = useTheme();
  const tintColor = theme.colors[color];

  if (Platform.OS === 'ios' && sf) {
    return <SymbolView name={sf} size={size} tintColor={tintColor} />;
  }

  return <Ionicons name={name} size={size} color={tintColor} />;
}
