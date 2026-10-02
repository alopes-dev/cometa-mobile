import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import { nearbyMapPhoto } from '../../assets';
import { discovery } from '../../content';
import type { NearbyPin } from '../../types';
import { Container, OpenMapPill, PIN_ICON_SIZE, Pin } from './NearbyMapCard.styles';

export type NearbyMapCardProps = {
  pins: NearbyPin[];
  onPress: () => void;
};

/**
 * "Nearby" — node 48:20361.
 *
 * A still of the map with the merchants marked on it, not a live `MapView`.
 * The card is a doorway: nothing on it pans, zooms or updates, so rendering
 * it through Mapbox would buy a tile download and a GL context for a preview
 * most people scroll straight past. The live map belongs behind "Ver mapa".
 *
 * The whole card is the target rather than just the pill — the pill names the
 * action, but a 180pt picture of a map that does nothing when tapped reads as
 * broken.
 */
export function NearbyMapCard({ pins, onPress }: NearbyMapCardProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={discovery.openMap}
    >
      <Animated.View style={pressStyle}>
        <Container>
          <Image
            source={nearbyMapPhoto}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          {pins.map((pin) => (
            <Pin key={pin.id} x={pin.x} y={pin.y} accessibilityLabel={discovery.merchantPin}>
              <Icon
                name="storefront-outline"
                sf="storefront.fill"
                size={PIN_ICON_SIZE}
                color="onBrand"
              />
            </Pin>
          ))}
          <OpenMapPill>
            <Text variant="labelSmall">{discovery.openMap}</Text>
          </OpenMapPill>
        </Container>
      </Animated.View>
    </Pressable>
  );
}
