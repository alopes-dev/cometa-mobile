import { Pressable } from 'react-native';
import { Text, Icon, type IconProps } from '@/components/design-system/atoms';
import { Container, IconCircle, Info, RadioCircle } from './OptionCard.styles';

export type OptionCardProps = {
  icon: { name: IconProps['name']; sf?: IconProps['sf'] };
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionCard({ icon, title, subtitle, selected, onPress }: OptionCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }}>
      <Container selected={selected}>
        <IconCircle>
          <Icon name={icon.name} sf={icon.sf} size={18} color="brand" />
        </IconCircle>
        <Info>
          <Text variant="title">{title}</Text>
          {subtitle ? (
            <Text variant="caption" color="secondary">
              {subtitle}
            </Text>
          ) : null}
        </Info>
        <RadioCircle selected={selected}>
          {selected ? <Icon name="checkmark" sf="checkmark" size={12} color="onBrand" /> : null}
        </RadioCircle>
      </Container>
    </Pressable>
  );
}
