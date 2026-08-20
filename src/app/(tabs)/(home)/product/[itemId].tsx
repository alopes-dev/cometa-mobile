import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import { Button, Icon, QuantityStepper, Text, TextField } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { useCart } from '@/hooks/useCart';
import type { CartSelection } from '@/hooks/CartProvider';
import { getMenuItemById } from '@/features/home/data';
import { formatKwanza } from '@/features/home/format';
import { computeUnitPrice, hasRequiredSelections } from '@/features/home/modifierPricing';
import { ModifierGroupSelector } from '@/features/home/components/ModifierGroupSelector';

const ADDED_CONFIRMATION_DELAY = 550;

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeroImage = styled(Image)`
  width: 100%;
  height: 260px;
`;

const BackButton = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const BackButtonWrapper = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ theme, topInset }) => theme.spacing.sm + topInset}px;
  left: ${({ theme }) => theme.spacing.md}px;
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const TitleGroup = styled.View`
  gap: 4px;
`;

const QuantityRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BottomBar = styled.View<{ bottomInset: number }>`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  bottom: ${({ theme, bottomInset }) => bottomInset + theme.spacing.sm}px;
`;

const NotFoundScreen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default function ProductDetail() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();

  const item = useMemo(() => getMenuItemById(itemId), [itemId]);
  const groups = item?.modifierGroups ?? [];

  const [selections, setSelections] = useState<CartSelection[]>(() =>
    groups
      .filter((group) => group.required && group.type === 'single' && group.options.length > 0)
      .map((group) => ({ groupId: group.id, optionIds: [group.options[0].id] }))
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { style: bounceStyle, bounce } = useBounceAnimation();

  useEffect(() => () => clearTimeout(addedTimeout.current), []);

  if (!item) {
    return (
      <NotFoundScreen>
        <Text color="textSecondary">Produto não encontrado</Text>
      </NotFoundScreen>
    );
  }

  const toggleOption = (groupId: string, optionId: string, type: 'single' | 'multiple') => {
    setSelections((current) => {
      const existingIndex = current.findIndex((selection) => selection.groupId === groupId);

      if (type === 'single') {
        const next = current.filter((selection) => selection.groupId !== groupId);
        next.push({ groupId, optionIds: [optionId] });
        return next;
      }

      if (existingIndex === -1) {
        return [...current, { groupId, optionIds: [optionId] }];
      }

      const existing = current[existingIndex];
      const hasOption = existing.optionIds.includes(optionId);
      const optionIds = hasOption
        ? existing.optionIds.filter((id) => id !== optionId)
        : [...existing.optionIds, optionId];

      const next = [...current];
      if (optionIds.length === 0) {
        next.splice(existingIndex, 1);
      } else {
        next[existingIndex] = { groupId, optionIds };
      }
      return next;
    });
  };

  const unitPrice = computeUnitPrice(item, selections);
  const totalPrice = unitPrice * quantity;
  const canAdd = hasRequiredSelections(item, selections);

  const handleAdd = () => {
    if (justAdded) return;
    const trimmedNotes = notes.trim() || undefined;
    for (let index = 0; index < quantity; index += 1) {
      addItem(item, { selections, notes: trimmedNotes });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    bounce();
    setJustAdded(true);
    addedTimeout.current = setTimeout(() => router.back(), ADDED_CONFIRMATION_DELAY);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <HeroImage source={{ uri: item.imageUrl }} contentFit="cover" />
          <BackButtonWrapper topInset={insets.top}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
              <BackButton>
                <Icon name="chevron-back" sf="chevron.left" size={18} color="textPrimary" />
              </BackButton>
            </Pressable>
          </BackButtonWrapper>
        </View>
        <Content>
          <TitleGroup>
            <Text variant="title1">{item.name}</Text>
            <Text variant="bodyEmphasized" color="primary">
              {formatKwanza(item.price)}
            </Text>
            <Text variant="body" color="textSecondary">
              {item.description}
            </Text>
          </TitleGroup>

          {groups.map((group) => {
            const selection = selections.find((candidate) => candidate.groupId === group.id);
            return (
              <ModifierGroupSelector
                key={group.id}
                group={group}
                selectedOptionIds={selection?.optionIds ?? []}
                onToggle={(optionId) => toggleOption(group.id, optionId, group.type)}
              />
            );
          })}

          <TextField
            label="Observação"
            placeholder="Ex: Sem cebola"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <QuantityRow>
            <Text variant="bodyEmphasized">Quantidade</Text>
            <QuantityStepper
              quantity={quantity}
              onIncrement={() => setQuantity((current) => current + 1)}
              onDecrement={() => setQuantity((current) => Math.max(1, current - 1))}
            />
          </QuantityRow>
        </Content>
      </ScrollView>
      <BottomBar bottomInset={insets.bottom}>
        <Animated.View style={bounceStyle}>
          <Button
            variant="primary"
            size="lg"
            shape="pill"
            disabled={!canAdd}
            icon={justAdded ? <Icon name="checkmark" sf="checkmark" size={18} color="onPrimary" /> : undefined}
            onPress={handleAdd}
          >
            {justAdded ? 'Adicionado ao carrinho' : `Adicionar — ${formatKwanza(totalPrice)}`}
          </Button>
        </Animated.View>
      </BottomBar>
    </Screen>
  );
}
