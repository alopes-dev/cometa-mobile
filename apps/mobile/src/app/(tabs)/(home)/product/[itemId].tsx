import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import { Text, TextField } from '@/components/design-system/atoms';
import { useCart } from '@/hooks/useCart';
import type { CartSelection } from '@/hooks/CartProvider';
import { getMenuItemById } from '@/features/home/data';
import { formatKwanza } from '@/features/home/format';
import { computeUnitPrice, hasRequiredSelections } from '@/features/home/modifierPricing';
import { ModifierGroupSelector } from '@/features/home/components/ModifierGroupSelector';
import { ProductActionRow } from '@/features/home/components/ProductActionRow';
import { ProductCartBar } from '@/features/home/components/ProductCartBar';
import { ProductHero } from '@/features/home/components/ProductHero';
import { product, productTextStyle } from '@/theme';

/**
 * How long "Adicionado ✓" (node 48:20770) holds before the button returns to
 * its resting label. The board draws the added state as a frame of its own,
 * not an end state: the screen stays put — the floating cart is what persists
 * — so the button has to become addable again for a second helping.
 */
const ADDED_CONFIRMATION_DURATION = 1500;

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

/** `Detalhe` — node 48:20707. */
const Detail = styled.View`
  padding-horizontal: ${({ theme }) => theme.product.metrics.detailPaddingHorizontal}px;
  padding-vertical: ${({ theme }) => theme.product.metrics.detailPaddingVertical}px;
  gap: ${({ theme }) => theme.product.metrics.detailGap}px;
`;

/** `Título e preço` — node 48:20708. */
const TitleGroup = styled.View`
  gap: ${({ theme }) => theme.product.metrics.titleGap}px;
`;

/** `Descrição` — node 48:20710. */
const Description = styled.Text`
  ${productTextStyle('description')}
  color: ${({ theme }) => theme.colors.text.secondary};
`;

/** `Preço` — node 48:20711. */
const Price = styled.Text`
  ${productTextStyle('price')}
  color: ${({ theme }) => theme.colors.text.brand};
`;

/** `Personalizar` — node 48:20712. */
const Customize = styled.View`
  gap: ${({ theme }) => theme.product.metrics.customizeGap}px;
`;

const NotFoundScreen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

/** `Produto — Classic Burger` — frame 48:20693. */
export default function ProductDetail() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem, count: cartCount, subtotal: cartSubtotal } = useCart();

  const item = useMemo(() => getMenuItemById(itemId), [itemId]);
  const groups = item?.modifierGroups ?? [];

  const [selections, setSelections] = useState<CartSelection[]>(() =>
    groups
      .filter((group) => group.required && group.type === 'single' && group.options.length > 0)
      .map((group) => ({ groupId: group.id, optionIds: [group.options[0].id] }))
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(addedTimeout.current), []);

  if (!item) {
    return (
      <NotFoundScreen>
        <Text color="secondary">Produto não encontrado</Text>
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
    setJustAdded(true);
    addedTimeout.current = setTimeout(() => setJustAdded(false), ADDED_CONFIRMATION_DURATION);
  };

  // Clears the floating cart (node 48:20772), which overlaps the scroll.
  const scrollBottomPadding =
    product.metrics.cartBarHeight + product.metrics.cartBarBottom * 2 + insets.bottom;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <ProductHero
          source={item.imageUrl}
          topInset={insets.top}
          onBack={() => router.back()}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite((current) => !current)}
        />

        <Detail>
          <TitleGroup>
            <Text variant="h1">{item.name}</Text>
            <Description>{item.description}</Description>
            {/*
              The unit price, not `item.price`: the board shows the two as the
              same number because nothing is selected yet, and keeping it at
              the base price would quietly disagree with the total on the
              button the moment a paid extra is ticked.
            */}
            <Price>{formatKwanza(unitPrice)}</Price>
          </TitleGroup>

          {groups.length > 0 ? (
            <Customize>
              {/* `Título` — node 48:20713. */}
              <Text variant="h5">Personaliza o teu</Text>
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
            </Customize>
          ) : null}

          {/*
            Not on the board, which mocks an item with no note attached. Kept
            because the cart already carries notes through to the kitchen, and
            dropping the field would remove a working capability rather than
            restyle one.
          */}
          <TextField
            label="Observação"
            placeholder="Ex: Sem cebola"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <ProductActionRow
            quantity={quantity}
            onIncrement={() => setQuantity((current) => current + 1)}
            onDecrement={() => setQuantity((current) => Math.max(1, current - 1))}
            addLabel={`Adicionar · ${formatKwanza(totalPrice)}`}
            added={justAdded}
            disabled={!canAdd}
            onAdd={handleAdd}
          />
        </Detail>
      </ScrollView>

      <ProductCartBar
        count={cartCount}
        total={cartSubtotal}
        bottomInset={insets.bottom}
        onPress={() => router.push('/cart')}
      />
    </Screen>
  );
}
