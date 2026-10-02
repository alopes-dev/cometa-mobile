import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { NotificationBell } from '@/components/design-system/molecules';
import { usePressScale } from '@/hooks/usePressScale';
import { search } from '../../content';
import { BACK_ICON_SIZE, BackButton, Container, Title } from './SearchResultsHeader.styles';

export type SearchResultsHeaderProps = {
  onBack: () => void;
  /** Shows the dot over the bell. */
  hasUnread?: boolean;
  onPressNotifications?: () => void;
};

/**
 * The results header — node 48:20163.
 *
 * The title says "Resultados" rather than the query: the query is already on
 * screen, in the field directly below, where it can also be edited.
 */
export function SearchResultsHeader({
  onBack,
  hasUnread = false,
  onPressNotifications,
}: SearchResultsHeaderProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale(0.94);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onBack();
  };

  return (
    <Container>
      <Pressable
        onPress={handleBack}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={search.back}
        hitSlop={8}
      >
        <Animated.View style={pressStyle}>
          <BackButton>
            <Icon name="chevron-back" sf="chevron.left" size={BACK_ICON_SIZE} color="primary" />
          </BackButton>
        </Animated.View>
      </Pressable>

      <Title>
        <Text variant="h3" numberOfLines={1}>
          {search.resultsTitle}
        </Text>
      </Title>

      <NotificationBell
        hasUnread={hasUnread}
        onPress={onPressNotifications}
        accessibilityLabel={
          hasUnread ? `${search.notifications}, ${search.unreadNotifications}` : search.notifications
        }
      />
    </Container>
  );
}
