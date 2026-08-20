import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text, Icon } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { usePressScale } from '@/hooks/usePressScale';
import { useMeasureOnTap, type ScreenOrigin } from '@/hooks/useMeasureOnTap';
import { formatKwanza } from '../../format';
import type { MenuItem } from '../../types';
import { AddButton, Container, Info, PriceText, Thumbnail, ThumbnailClip } from './MenuItemRow.styles';

export type MenuItemRowProps = {
  item: MenuItem;
  onAdd?: (origin: ScreenOrigin) => void;
  onPress?: () => void;
};

export function MenuItemRow({ item, onAdd, onPress }: MenuItemRowProps) {
  const { style: bounceStyle, bounce } = useBounceAnimation();
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();
  const { ref: addButtonRef, measure } = useMeasureOnTap();

  const handleAdd = async () => {
    bounce();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const origin = await measure();
    onAdd?.(origin);
  };

  const content = (
    <Container>
      <Info>
        <Text variant="bodyEmphasized">{item.name}</Text>
        <Text variant="footnote" color="textSecondary" numberOfLines={2}>
          {item.description}
        </Text>
        <PriceText>{formatKwanza(item.price)}</PriceText>
      </Info>
      {onAdd ? (
        <Pressable onPress={handleAdd} accessibilityRole="button" accessibilityLabel={`Adicionar ${item.name}`} hitSlop={8}>
          <Animated.View ref={addButtonRef} style={bounceStyle}>
            <AddButton>
              <Icon name="add" sf="plus" size={16} color="onSecondary" />
            </AddButton>
          </Animated.View>
        </Pressable>
      ) : null}
      <Thumbnail>
        <ThumbnailClip>
          <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </ThumbnailClip>
      </Thumbnail>
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
