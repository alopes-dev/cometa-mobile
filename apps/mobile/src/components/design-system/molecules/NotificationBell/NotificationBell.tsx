import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Icon } from '@/components/design-system/atoms';
import { useBounceAnimation } from '@/hooks/useBounceAnimation';
import { Disc, Slot, UnreadIndicator } from './NotificationBell.styles';

const ICON_SIZE = 20;

export type NotificationBellProps = {
  /** Shows the dot over the bell. */
  hasUnread?: boolean;
  onPress?: () => void;
  /**
   * What the control says out loud. Colour alone must never carry the unread
   * state, so a caller with something waiting says so here as well (§44).
   */
  accessibilityLabel: string;
};

/**
 * The notification bell every screen header carries (nodes 48:20256,
 * 48:20168).
 *
 * One component rather than one per header: Discovery and Search draw the
 * identical disc, and a second copy is how the dot ends up a different size
 * on one screen than the other.
 */
export function NotificationBell({ hasUnread = false, onPress, accessibilityLabel }: NotificationBellProps) {
  const { style: bounceStyle, bounce } = useBounceAnimation(0.9);

  const handlePress = () => {
    bounce();
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      // The disc is 40, four short of the HIG minimum; the slop makes up the
      // difference without growing the header past the row the board draws.
      hitSlop={8}
    >
      <Animated.View style={bounceStyle}>
        <Slot>
          <Disc>
            <Icon name="notifications-outline" sf="bell" size={ICON_SIZE} color="primary" />
          </Disc>
          {hasUnread ? <UnreadIndicator testID="unread-indicator" /> : null}
        </Slot>
      </Animated.View>
    </Pressable>
  );
}
