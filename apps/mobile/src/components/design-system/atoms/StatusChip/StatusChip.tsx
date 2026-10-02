import { Platform } from 'react-native';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { Container, Label, type DeliveryStatus } from './StatusChip.styles';

export type { DeliveryStatus };

export type StatusChipProps = {
  status: DeliveryStatus;
  /** Always required: the state must survive without color (§44). */
  label: string;
  icon?: { name: keyof typeof Ionicons.glyphMap; sf?: SFSymbol };
};

/**
 * A delivery-state chip.
 *
 * `label` is mandatory and the icon is rendered in the status color rather
 * than a generic foreground role, so the chip reads as one object. There is
 * deliberately no color-only variant: a bare colored dot would make state
 * invisible to a color-blind user, and the status palette puts `warning` and
 * `error` only 32° apart in hue precisely because the label is doing the work.
 */
export function StatusChip({ status, label, icon }: StatusChipProps) {
  const theme = useTheme();
  const tint = theme.colors.delivery[status].fg;
  const size = 14;

  return (
    <Container status={status} accessibilityRole="text" accessibilityLabel={label}>
      {icon ? (
        Platform.OS === 'ios' && icon.sf ? (
          <SymbolView name={icon.sf} size={size} tintColor={tint} style={{ width: size, height: size }} />
        ) : (
          <Ionicons name={icon.name} size={size} color={tint} />
        )
      ) : null}
      <Label status={status}>{label}</Label>
    </Container>
  );
}
