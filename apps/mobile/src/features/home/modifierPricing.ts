import type { MenuItem } from './types';
import type { CartSelection } from '@/hooks/CartProvider';

export function computeUnitPrice(item: MenuItem, selections: CartSelection[]): number {
  const groups = item.modifierGroups ?? [];
  const delta = selections.reduce((sum, selection) => {
    const group = groups.find((candidate) => candidate.id === selection.groupId);
    if (!group) return sum;
    const optionsDelta = selection.optionIds.reduce((optionSum, optionId) => {
      const option = group.options.find((candidate) => candidate.id === optionId);
      return optionSum + (option?.priceDelta ?? 0);
    }, 0);
    return sum + optionsDelta;
  }, 0);
  return item.price + delta;
}

export function hasRequiredSelections(item: MenuItem, selections: CartSelection[]): boolean {
  const groups = item.modifierGroups ?? [];
  return groups
    .filter((group) => group.required)
    .every((group) => {
      const selection = selections.find((candidate) => candidate.groupId === group.id);
      return Boolean(selection && selection.optionIds.length > 0);
    });
}
