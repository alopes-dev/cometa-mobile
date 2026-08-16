import { Pressable } from 'react-native';
import { Text, Icon } from '@/components/design-system/atoms';
import { formatKwanza } from '../../format';
import type { ModifierGroup } from '../../types';
import { Container, Header, OptionRow, IndicatorCircle, IndicatorSquare } from './ModifierGroupSelector.styles';

export type ModifierGroupSelectorProps = {
  group: ModifierGroup;
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
};

export function ModifierGroupSelector({ group, selectedOptionIds, onToggle }: ModifierGroupSelectorProps) {
  return (
    <Container>
      <Header>
        <Text variant="bodyEmphasized">{group.label}</Text>
        <Text variant="footnote" color="textSecondary">
          {group.required ? 'Obrigatório' : 'Opcional'}
        </Text>
      </Header>
      {group.options.map((option) => {
        const selected = selectedOptionIds.includes(option.id);
        const Indicator = group.type === 'single' ? IndicatorCircle : IndicatorSquare;
        return (
          <Pressable
            key={option.id}
            onPress={() => onToggle(option.id)}
            accessibilityRole={group.type === 'single' ? 'radio' : 'checkbox'}
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.label}
          >
            <OptionRow>
              <Indicator selected={selected}>
                {selected ? <Icon name="checkmark" sf="checkmark" size={12} color="onPrimary" /> : null}
              </Indicator>
              <Text variant="body" style={{ flex: 1 }}>
                {option.label}
              </Text>
              {option.priceDelta > 0 ? (
                <Text variant="footnote" color="textSecondary">
                  +{formatKwanza(option.priceDelta)}
                </Text>
              ) : null}
            </OptionRow>
          </Pressable>
        );
      })}
    </Container>
  );
}
