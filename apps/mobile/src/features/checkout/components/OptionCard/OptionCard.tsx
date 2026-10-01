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
          <Icon name={icon.name} sf={icon.sf} size={18} color="primary" />
        </IconCircle>
        <Info>
          <Text variant="bodyEmphasized">{title}</Text>
          {subtitle ? (
            <Text variant="footnote" color="textSecondary">
              {subtitle}
            </Text>
          ) : null}
        </Info>
        <RadioCircle selected={selected}>
          {selected ? <Icon name="checkmark" sf="checkmark" size={12} color="onPrimary" /> : null}
        </RadioCircle>
      </Container>
    </Pressable>
  );
}
