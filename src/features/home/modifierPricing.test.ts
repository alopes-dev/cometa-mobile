import { computeUnitPrice } from './modifierPricing';
import type { MenuItem } from './types';

const burger: MenuItem = {
  id: 'r1-1',
  restaurantId: 'r1',
  name: 'Cheeseburger Clássico',
  description: 'Hambúrguer de carne, queijo cheddar, alface e tomate.',
  price: 3000,
  imageUrl: 'https://picsum.photos/seed/r1-1/200/200',
  category: 'Pratos Principais',
  modifierGroups: [
    {
      id: 'pao',
      label: 'Escolha o pão',
      type: 'single',
      required: true,
      options: [
        { id: 'pao-tradicional', label: 'Tradicional', priceDelta: 0 },
        { id: 'pao-brioche', label: 'Brioche', priceDelta: 300 },
      ],
    },
    {
      id: 'extras',
      label: 'Extras',
      type: 'multiple',
      required: false,
      options: [
        { id: 'extra-bacon', label: 'Bacon', priceDelta: 700 },
        { id: 'extra-ovo', label: 'Ovo', priceDelta: 500 },
      ],
    },
  ],
};

describe('computeUnitPrice', () => {
  it('returns the base price when there are no selections', () => {
    expect(computeUnitPrice(burger, [])).toBe(3000);
  });

  it('adds a single-select option delta', () => {
    expect(computeUnitPrice(burger, [{ groupId: 'pao', optionIds: ['pao-brioche'] }])).toBe(3300);
  });

  it('sums multi-select option deltas', () => {
    expect(computeUnitPrice(burger, [{ groupId: 'extras', optionIds: ['extra-bacon', 'extra-ovo'] }])).toBe(4200);
  });

  it('combines multiple groups', () => {
    const total = computeUnitPrice(burger, [
      { groupId: 'pao', optionIds: ['pao-brioche'] },
      { groupId: 'extras', optionIds: ['extra-bacon'] },
    ]);
    expect(total).toBe(4000);
  });

  it('ignores an unknown group or option id', () => {
    expect(computeUnitPrice(burger, [{ groupId: 'does-not-exist', optionIds: ['x'] }])).toBe(3000);
  });
});
