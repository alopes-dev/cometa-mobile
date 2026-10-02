import { Pressable } from 'react-native';
import { Text, Icon, type IconProps } from '@/components/design-system/atoms';
import { Container, IconCircle, Info } from './DetailsRow.styles';

export type DetailsRowProps = {
  icon: { name: IconProps['name']; sf?: IconProps['sf'] };
  title: string;
  subtitle: string;
  trailing?: 'chevron' | string;
  onPress?: () => void;
};

export function DetailsRow({ icon, title, subtitle, trailing, onPress }: DetailsRowProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}>
      <Container>
        <IconCircle>
          <Icon name={icon.name} sf={icon.sf} size={18} color="brand" />
        </IconCircle>
        <Info>
          <Text variant="title" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        </Info>
        {trailing === 'chevron' ? (
          <Icon name="chevron-forward" sf="chevron.right" size={16} color="secondary" />
        ) : trailing ? (
          <Text variant="caption" color="brand">
            {trailing}
          </Text>
        ) : null}
      </Container>
    </Pressable>
  );
}
