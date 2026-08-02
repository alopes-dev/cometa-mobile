import type { IconProps } from '@/components/design-system/atoms';

export type CategoryIcon = { name: IconProps['name']; sf: IconProps['sf'] };

const ALL_ICON: CategoryIcon = { name: 'restaurant-outline', sf: 'fork.knife' };
const DEFAULT_ICON: CategoryIcon = ALL_ICON;

const KEYWORD_ICONS: Array<{ keyword: string; icon: CategoryIcon }> = [
  { keyword: 'pizza', icon: { name: 'pizza-outline', sf: 'fork.knife' } },
  { keyword: 'ital', icon: { name: 'pizza-outline', sf: 'fork.knife' } },
  { keyword: 'japon', icon: { name: 'fish-outline', sf: 'fish' } },
  { keyword: 'sushi', icon: { name: 'fish-outline', sf: 'fish' } },
  { keyword: 'marisco', icon: { name: 'fish-outline', sf: 'fish' } },
  { keyword: 'fast food', icon: { name: 'fast-food-outline', sf: 'takeoutbag.and.cup.and.straw.fill' } },
  { keyword: 'grelhado', icon: { name: 'flame-outline', sf: 'flame' } },
  { keyword: 'saud', icon: { name: 'leaf-outline', sf: 'leaf' } },
];

export function getCategoryIcon(category: string | null): CategoryIcon {
  if (category === null) return ALL_ICON;

  const normalized = category.toLowerCase();
  const match = KEYWORD_ICONS.find(({ keyword }) => normalized.includes(keyword));
  return match?.icon ?? DEFAULT_ICON;
}
