import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Icon, Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';
import { OptionCard } from '@/features/checkout/components/OptionCard';
import { SCHEDULE_SLOTS } from '@/features/checkout/mockData';

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
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const BottomBar = styled.View<{ bottomInset: number }>`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme, bottomInset }) => bottomInset + theme.spacing.md}px;
`;

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { deliveryType, schedule, setSchedule } = useCheckoutFlow();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const handleContinue = () => {
    router.push(deliveryType === 'delivery' ? '/address' : '/checkout');
  };

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">Quando?</Text>
      </Header>
      <Content>
        <OptionCard
          icon={{ name: 'flash-outline', sf: 'bolt.fill' }}
          title="Agora"
          subtitle="Entrega mais rápida disponível"
          selected={schedule?.type === 'now'}
          onPress={() => setSchedule({ type: 'now' })}
        />
        <View>
          {SCHEDULE_SLOTS.map((slot) => (
            <View key={slot.id} style={{ marginBottom: 8 }}>
              <OptionCard
                icon={{ name: 'calendar-outline', sf: 'calendar' }}
                title={slot.label}
                selected={schedule?.type === 'scheduled' && schedule.slotId === slot.id}
                onPress={() => setSchedule({ type: 'scheduled', slotId: slot.id, label: slot.label })}
              />
            </View>
          ))}
        </View>
      </Content>
      <BottomBar bottomInset={insets.bottom}>
        <Button variant="primary" size="lg" shape="pill" disabled={!schedule} onPress={handleContinue}>
          Continuar
        </Button>
      </BottomBar>
    </Screen>
  );
}
