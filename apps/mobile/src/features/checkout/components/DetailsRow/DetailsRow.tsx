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
          <Icon name={icon.name} sf={icon.sf} size={18} color="primary" />
        </IconCircle>
        <Info>
          <Text variant="bodyEmphasized" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="footnote" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        </Info>
        {trailing === 'chevron' ? (
          <Icon name="chevron-forward" sf="chevron.right" size={16} color="textSecondary" />
        ) : trailing ? (
          <Text variant="footnote" color="primary">
            {trailing}
          </Text>
        ) : null}
      </Container>
    </Pressable>
  );
}
