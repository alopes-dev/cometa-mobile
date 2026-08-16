import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Icon, Text, TextField } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { OptionCard } from '@/features/checkout/components/OptionCard';
import { mockAddresses } from '@/features/checkout/mockData';
import type { Address } from '@/features/checkout/types';

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
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const AddRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const NewAddressForm = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const BottomBar = styled.View<{ bottomInset: number }>`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme, bottomInset }) => bottomInset + theme.spacing.md}px;
`;

export default function AddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { addressId, setAddressId } = useCheckoutFlow();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDetails, setNewDetails] = useState('');

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const handleSaveNewAddress = () => {
    if (!newLabel.trim() || !newDetails.trim()) return;
    const id = `custom-${addresses.length}`;
    setAddresses((current) => [...current, { id, label: newLabel.trim(), details: newDetails.trim() }]);
    setAddressId(id);
    setIsAddingNew(false);
    setNewLabel('');
    setNewDetails('');
  };

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">Onde entregar?</Text>
      </Header>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <Content>
          {addresses.map((address) => (
            <OptionCard
              key={address.id}
              icon={{ name: 'location-outline', sf: 'location' }}
              title={address.label}
              subtitle={address.details}
              selected={addressId === address.id}
              onPress={() => setAddressId(address.id)}
            />
          ))}

          {isAddingNew ? (
            <NewAddressForm>
              <TextField label="Nome" placeholder="Ex: Casa da minha mãe" value={newLabel} onChangeText={setNewLabel} />
              <TextField
                label="Endereço"
                placeholder="Rua, número, bairro"
                value={newDetails}
                onChangeText={setNewDetails}
              />
              <Button variant="primary" onPress={handleSaveNewAddress}>
                Guardar endereço
              </Button>
            </NewAddressForm>
          ) : (
            <Pressable onPress={() => setIsAddingNew(true)} accessibilityRole="button">
              <AddRow>
                <Icon name="add-circle-outline" sf="plus.circle" size={18} color="primary" />
                <Text variant="footnote" color="primary">
                  Adicionar novo endereço
                </Text>
              </AddRow>
            </Pressable>
          )}
        </Content>
      </ScrollView>
      <BottomBar bottomInset={insets.bottom}>
        <Button variant="primary" size="lg" shape="pill" disabled={!addressId} onPress={() => router.push('/checkout')}>
          Continuar
        </Button>
      </BottomBar>
    </Screen>
  );
}
