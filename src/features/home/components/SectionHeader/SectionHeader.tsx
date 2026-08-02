import { Pressable } from 'react-native';
import { Text } from '@/components/design-system/atoms';
import { Container } from './SectionHeader.styles';

export type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <Container>
      <Text variant="title2">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onPressAction} accessibilityRole="button">
          <Text variant="footnote" color="brandAccent">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </Container>
  );
}
