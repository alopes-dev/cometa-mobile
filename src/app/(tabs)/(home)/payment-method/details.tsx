import { useCallback, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Icon, Text, TextField } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { getPaymentMethodOption } from '@/features/checkout/mockData';
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
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Field = styled.View`
  flex: 1;
`;

const InstructionsCard = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const last4 = (value: string) => value.replace(/\D/g, '').slice(-4).padStart(4, '0');

export default function PaymentMethodDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { type } = useLocalSearchParams<{ type: PaymentMethodType }>();
  const { setPaymentMethod } = useCheckoutFlow();
  const option = getPaymentMethodOption(type);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [phone, setPhone] = useState('');

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const canConfirm =
    type === 'multicaixa'
      ? true
      : type === 'card'
        ? cardNumber.trim().length > 0 && expiry.trim().length > 0 && cvv.trim().length > 0
        : phone.trim().length > 0;

  const handleConfirm = () => {
    const detailsLabel =
      type === 'card'
        ? `Cartão ····${last4(cardNumber)}`
        : type === 'multicaixa'
          ? option.label
          : `${option.label} ····${last4(phone)}`;
    setPaymentMethod({ type, detailsLabel });
    router.navigate('/checkout');
  };

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">{option.label}</Text>
      </Header>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <Content>
          {type === 'card' ? (
            <>
              <TextField
                label="Número do cartão"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
              />
              <Row>
                <Field>
                  <TextField label="Validade" placeholder="MM/AA" value={expiry} onChangeText={setExpiry} />
                </Field>
                <Field>
                  <TextField
                    label="CVV"
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="number-pad"
                    secureTextEntry
                  />
                </Field>
              </Row>
            </>
          ) : type === 'multicaixa' ? (
            <InstructionsCard>
              <Text variant="bodyEmphasized">Confirme na app Multicaixa Express</Text>
              <Text variant="body" color="textSecondary">
                Abra a aplicação Multicaixa Express no seu telemóvel e aprove o pagamento quando o pedido for
                finalizado.
              </Text>
            </InstructionsCard>
          ) : (
            <TextField
              label="Número de telemóvel"
              placeholder="9XX XXX XXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          )}

          <Button variant="primary" size="lg" shape="pill" disabled={!canConfirm} onPress={handleConfirm}>
            Confirmar
          </Button>
        </Content>
      </ScrollView>
    </Screen>
  );
}
