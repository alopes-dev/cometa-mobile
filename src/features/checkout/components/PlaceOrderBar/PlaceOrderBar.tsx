import { ActivityIndicator, Pressable, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Icon } from '@/components/design-system/atoms';
import { formatKwanza } from '@/features/home/format';
import { Container, TotalLabel, TotalValue, ButtonContent, ButtonLabel } from './PlaceOrderBar.styles';

export type PlaceOrderBarProps = {
  total: number;
  isLoading?: boolean;
  onPress: () => void;
};

export function PlaceOrderBar({ total, isLoading = false, onPress }: PlaceOrderBarProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={isLoading ? undefined : onPress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel="Fazer pedido"
      accessibilityState={{ busy: isLoading }}
    >
      <Container>
        <View>
          <TotalLabel>TOTAL</TotalLabel>
          <TotalValue>{formatKwanza(total)}</TotalValue>
        </View>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.onPrimary} />
        ) : (
          <ButtonContent>
            <ButtonLabel>Place Order</ButtonLabel>
            <Icon name="arrow-forward" sf="arrow.right" size={18} color="onPrimary" />
          </ButtonContent>
        )}
      </Container>
    </Pressable>
  );
}
