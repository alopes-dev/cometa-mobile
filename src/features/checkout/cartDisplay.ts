import type { MenuItem } from '@/features/home/types';
import type { CartSelection } from '@/hooks/CartProvider';

export function describeSelections(item: MenuItem, selections: CartSelection[]): string {
  const groups = item.modifierGroups ?? [];
  const labels = selections.flatMap((selection) => {
    const group = groups.find((candidate) => candidate.id === selection.groupId);
    if (!group) return [];
    return selection.optionIds
      .map((optionId) => group.options.find((option) => option.id === optionId)?.label)
      .filter((label): label is string => Boolean(label));
  });
  return labels.join(', ');
}

export function describeCartLine(item: MenuItem, selections: CartSelection[], notes?: string): string {
  const parts = [describeSelections(item, selections), notes].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(' · ') : item.description;
}
