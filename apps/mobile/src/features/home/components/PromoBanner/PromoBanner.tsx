import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import type { Promotion } from '../../types';
import {
  BANNER_IMAGE_SIZE,
  Container,
  Cta,
  Message,
  toneFill,
  toneOnFill,
} from './PromoBanner.styles';

export type PromoBannerProps = {
  promotion: Promotion;
  onPress?: () => void;
};

/**
 * A merchandised banner — nodes 48:19819 ("Destaque") and 48:19885
 * ("Ofertas para ti").
 *
 * One component for both because the board draws one shape in two tones; the
 * tone travels with the promotion, so a campaign can change colour without a
 * code change.
 */
export function PromoBanner({ promotion, onPress }: PromoBannerProps) {
  const theme = useTheme();
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();
  const onFill = toneOnFill(theme, promotion.tone);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`${promotion.title}. ${promotion.subtitle}`}
      accessibilityHint={promotion.ctaLabel}
    >
      <Animated.View style={pressStyle}>
        <Container tone={promotion.tone}>
          <Message>
            <Text variant="h5" style={{ color: onFill }} numberOfLines={2}>
              {promotion.title}
            </Text>
            <Text variant="caption" style={{ color: onFill }} numberOfLines={2}>
              {promotion.subtitle}
            </Text>
            <Cta>
              <Text variant="labelSmall" style={{ color: toneFill(theme, promotion.tone) }}>
                {promotion.ctaLabel}
              </Text>
            </Cta>
          </Message>
          <Image
            source={promotion.imageUrl}
            style={{ width: BANNER_IMAGE_SIZE, height: BANNER_IMAGE_SIZE }}
            contentFit="cover"
          />
        </Container>
      </Animated.View>
    </Pressable>
  );
}
