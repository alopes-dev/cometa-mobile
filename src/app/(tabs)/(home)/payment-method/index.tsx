import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Icon, Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { OptionCard } from '@/features/checkout/components/OptionCard';
import { PAYMENT_METHOD_OPTIONS } from '@/features/checkout/mockData';
import type { PaymentMethodType } from '@/features/checkout/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View<{ topInset: number }>`
  padding-top: ${({ theme, topInset }) => theme.spacing.md + topInset}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const BackButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export default function PaymentMethodList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { paymentMethod, setPaymentMethod } = useCheckoutFlow();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const handleSelect = (type: PaymentMethodType) => {
    if (type === 'cash') {
      setPaymentMethod({ type: 'cash', detailsLabel: 'Dinheiro' });
      router.navigate('/checkout');
      return;
    }
    router.push({ pathname: '/payment-method/details', params: { type } });
  };

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">Pagamento</Text>
      </Header>
      <Content>
        {PAYMENT_METHOD_OPTIONS.map((option) => (
          <View key={option.type} style={{ marginBottom: 8 }}>
            <OptionCard
              icon={option.icon}
              title={option.label}
              subtitle={option.subtitle}
              selected={paymentMethod?.type === option.type}
              onPress={() => handleSelect(option.type)}
            />
          </View>
        ))}
      </Content>
    </Screen>
  );
}
