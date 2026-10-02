import { Platform } from "react-native";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import type { Theme } from "@/components/design-system/ThemeProvider";

/** A foreground role, not a token path — see `theme/roles.ts`. */
type ColorKey = keyof Theme["fg"];

export type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  sf?: SFSymbol;
  size?: number;
  color?: ColorKey;
};

export function Icon({ name, sf, size = 24, color = "primary" }: IconProps) {
  const theme = useTheme();
  const tintColor = theme.fg[color];

  if (Platform.OS === "ios" && sf) {
    return (
      <SymbolView
        name={sf}
        size={size}
        tintColor={tintColor}
        style={{ width: size, height: size }}
      />
    );
  }

  return <Ionicons name={name} size={size} color={tintColor} />;
}
