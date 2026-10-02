import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { Icon, Text } from '@/components/design-system/atoms';
import { usePressScale } from '@/hooks/usePressScale';
import { home } from '../../content';
import { Container, Message, Symbol } from './AssistantCard.styles';

export type AssistantCardProps = {
  onPress?: () => void;
};

/**
 * The "Hi Cometa" entry point — node 48:19921.
 *
 * Deliberately the last thing on Home: it is the fallback for a customer the
 * feed above did not manage to convince, not a competitor to it.
 */
export function AssistantCard({ onPress }: AssistantCardProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();

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
      accessibilityLabel={`${home.assistantTitle}. ${home.assistantBody}`}
    >
      <Animated.View style={pressStyle}>
        <Container>
          <Symbol>
            <Icon name="sparkles-outline" sf="sparkles" size={20} color="onBrand" />
          </Symbol>
          <Message>
            <Text variant="h6">{home.assistantTitle}</Text>
            <Text variant="caption" color="secondary">
              {home.assistantBody}
            </Text>
          </Message>
          <Icon name="chevron-forward" sf="chevron.right" size={18} color="muted" />
        </Container>
      </Animated.View>
    </Pressable>
  );
}
