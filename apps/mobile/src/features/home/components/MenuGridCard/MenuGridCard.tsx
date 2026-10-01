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
import { AddButton, Container, ImageWrapper, PriceText } from './MenuGridCard.styles';

export type MenuGridCardProps = {
  item: MenuItem;
  onAdd?: (origin: ScreenOrigin) => void;
  onPress?: () => void;
};

export function MenuGridCard({ item, onAdd, onPress }: MenuGridCardProps) {
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
      <ImageWrapper>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: 120, borderRadius: 12 }}
          contentFit="cover"
        />
        {onAdd ? (
          <Pressable
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={`Adicionar ${item.name}`}
            hitSlop={8}
          >
            <Animated.View ref={addButtonRef} style={bounceStyle}>
              <AddButton>
                <Icon name="add" sf="plus" size={14} color="onSecondary" />
              </AddButton>
            </Animated.View>
          </Pressable>
        ) : null}
      </ImageWrapper>
      <Text variant="footnote" numberOfLines={1}>
        {item.name}
      </Text>
      <Text variant="caption" color="textSecondary" numberOfLines={1}>
        {item.description}
      </Text>
      <PriceText>{formatKwanza(item.price)}</PriceText>
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
