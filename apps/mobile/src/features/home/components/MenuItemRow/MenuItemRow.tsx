import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from 'styled-components/native';
import { Icon } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { usePressScale } from '@/hooks/usePressScale';
import { useMeasureOnTap, type ScreenOrigin } from '@/hooks/useMeasureOnTap';
import { formatDiscountPercent, formatKwanza } from '../../format';
import type { MenuItem } from '../../types';
import {
  AddButton,
  AddButtonSlot,
  Container,
  Description,
  Discount,
  Info,
  Media,
  Name,
  NameRow,
  PreviousPriceText,
  PriceRow,
  PriceText,
} from './MenuItemRow.styles';

export type MenuItemRowProps = {
  item: MenuItem;
  onAdd?: (origin: ScreenOrigin) => void;
  onPress?: () => void;
};

export function MenuItemRow({ item, onAdd, onPress }: MenuItemRowProps) {
  const { style: bounceStyle, bounce } = useBounceAnimation();
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();
  const { ref: addButtonRef, measure } = useMeasureOnTap();
  const theme = useTheme();
  const discount =
    item.previousPrice === undefined ? null : formatDiscountPercent(item.previousPrice, item.price);

  const handleAdd = async () => {
    bounce();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const origin = await measure();
    onAdd?.(origin);
  };

  const content = (
    <Container>
      <Info>
        <NameRow>
          <Name>{item.name}</Name>
          {discount ? <Discount>{discount}</Discount> : null}
        </NameRow>
        <Description numberOfLines={2}>{item.description}</Description>
        <PriceRow>
          <PriceText>{formatKwanza(item.price)}</PriceText>
          {item.previousPrice !== undefined ? (
            <PreviousPriceText>{formatKwanza(item.previousPrice)}</PreviousPriceText>
          ) : null}
        </PriceRow>
      </Info>
      <Media>
        <Image
          source={item.imageUrl}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        {onAdd ? (
          <AddButtonSlot>
            <Pressable
              onPress={handleAdd}
              accessibilityRole="button"
              accessibilityLabel={`Adicionar ${item.name}`}
              hitSlop={8}
            >
              <Animated.View ref={addButtonRef} style={bounceStyle}>
                <AddButton>
                  <Icon
                    name="add"
                    sf="plus"
                    size={theme.business.metrics.addIconSize}
                    color="onBrand"
                  />
                </AddButton>
              </Animated.View>
            </Pressable>
          </AddButtonSlot>
        ) : null}
      </Media>
    </Container>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Ver ${item.name}`}
    >
      <Animated.View style={pressStyle}>{content}</Animated.View>
    </Pressable>
  );
}
