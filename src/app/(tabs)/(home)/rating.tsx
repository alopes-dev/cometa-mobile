import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Button, Icon, StarRating, Text } from '@/components/design-system/atoms';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import { getRestaurantById } from '@/features/home/data';
import { mockDriver } from '@/features/tracking/mockData';
import { DRIVER_CRITERIA, RESTAURANT_CRITERIA } from '@/features/rating/mockData';

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
  gap: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const CategoryCard = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const CategoryHeader = styled.View`
  gap: 2px;
  align-items: center;
`;

const OverallRating = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CriteriaDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

const CriterionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ThankYouScreen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const IconCircle = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export default function Rating() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsTabBarHidden } = useTabBarVisibility();
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

  const [restaurantOverall, setRestaurantOverall] = useState(0);
  const [restaurantCriteria, setRestaurantCriteria] = useState<Record<string, number>>({});
  const [driverOverall, setDriverOverall] = useState(0);
  const [driverCriteria, setDriverCriteria] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsTabBarHidden(true);
      return () => setIsTabBarHidden(false);
    }, [setIsTabBarHidden])
  );

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;
  const canSubmit = restaurantOverall > 0 && driverOverall > 0;

  const setCriterion = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    key: string,
    value: number
  ) => {
    setter((current) => ({ ...current, [key]: value }));
  };

  if (submitted) {
    return (
      <Screen>
        <ThankYouScreen>
          <IconCircle>
            <Icon name="checkmark" sf="checkmark" size={36} color="onPrimary" />
          </IconCircle>
          <Text variant="title1">Obrigado pela sua avaliação!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
            A sua opinião ajuda o restaurante e o entregador a melhorar.
          </Text>
          <Button variant="primary" size="lg" shape="pill" onPress={() => router.replace('/')}>
            Voltar ao Início
          </Button>
        </ThankYouScreen>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header topInset={insets.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
          </BackButton>
        </Pressable>
        <Text variant="headline">Avaliar Pedido</Text>
      </Header>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Content>
          <CategoryCard>
            <CategoryHeader>
              <Text variant="bodyEmphasized">{restaurant?.name ?? 'Restaurante'}</Text>
              <Text variant="footnote" color="textSecondary">
                Como estava sua comida?
              </Text>
            </CategoryHeader>
            <OverallRating>
              <StarRating value={restaurantOverall} onChange={setRestaurantOverall} label="Avaliação do restaurante" />
            </OverallRating>
            <CriteriaDivider />
            {RESTAURANT_CRITERIA.map((criterion) => (
              <CriterionRow key={criterion.key}>
                <Text variant="footnote" color="textSecondary">
                  {criterion.label}
                </Text>
                <StarRating
                  value={restaurantCriteria[criterion.key] ?? 0}
                  onChange={(value) => setCriterion(setRestaurantCriteria, criterion.key, value)}
                  size={18}
                  label={criterion.label}
                />
              </CriterionRow>
            ))}
          </CategoryCard>

          <CategoryCard>
            <CategoryHeader>
              <Text variant="bodyEmphasized">{mockDriver.name}</Text>
              <Text variant="footnote" color="textSecondary">
                Como foi sua entrega?
              </Text>
            </CategoryHeader>
            <OverallRating>
              <StarRating value={driverOverall} onChange={setDriverOverall} label="Avaliação do entregador" />
            </OverallRating>
            <CriteriaDivider />
            {DRIVER_CRITERIA.map((criterion) => (
              <CriterionRow key={criterion.key}>
                <Text variant="footnote" color="textSecondary">
                  {criterion.label}
                </Text>
                <StarRating
                  value={driverCriteria[criterion.key] ?? 0}
                  onChange={(value) => setCriterion(setDriverCriteria, criterion.key, value)}
                  size={18}
                  label={criterion.label}
                />
              </CriterionRow>
            ))}
          </CategoryCard>

          <Button variant="primary" size="lg" shape="pill" disabled={!canSubmit} onPress={() => setSubmitted(true)}>
            Enviar Avaliação
          </Button>
        </Content>
      </ScrollView>
    </Screen>
  );
}
