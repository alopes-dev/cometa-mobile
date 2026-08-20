import { Text } from '@/components/design-system/atoms';
import type { ModifierGroup } from '../../types';
import { Container, Header } from './ModifierGroupSelector.styles';
import { ModifierOptionRow } from './ModifierOptionRow';

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
      {group.options.map((option) => (
        <ModifierOptionRow
          key={option.id}
          option={option}
          type={group.type}
          selected={selectedOptionIds.includes(option.id)}
          onToggle={() => onToggle(option.id)}
        />
      ))}
    </Container>
  );
}
