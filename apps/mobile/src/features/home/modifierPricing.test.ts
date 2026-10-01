import { computeUnitPrice, hasRequiredSelections } from './modifierPricing';
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

const bowlWithRequiredExtras: MenuItem = {
  id: 'r5-1',
  restaurantId: 'r5',
  name: 'Poke Bowl',
  description: 'Monte a sua tigela.',
  price: 4000,
  imageUrl: 'https://picsum.photos/seed/r5-1/200/200',
  category: 'Pratos Principais',
  modifierGroups: [
    {
      id: 'toppings',
      label: 'Escolha os toppings',
      type: 'multiple',
      required: true,
      options: [
        { id: 'topping-mango', label: 'Manga', priceDelta: 0 },
        { id: 'topping-avocado', label: 'Abacate', priceDelta: 200 },
      ],
    },
  ],
};

describe('hasRequiredSelections', () => {
  it('is true when a required single-select group has a selected option', () => {
    expect(hasRequiredSelections(burger, [{ groupId: 'pao', optionIds: ['pao-tradicional'] }])).toBe(true);
  });

  it('is false when a required single-select group has no selection', () => {
    expect(hasRequiredSelections(burger, [])).toBe(false);
  });

  it('ignores optional groups entirely', () => {
    // 'extras' is optional and unselected, but 'pao' (required) is answered — should pass.
    expect(hasRequiredSelections(burger, [{ groupId: 'pao', optionIds: ['pao-tradicional'] }])).toBe(true);
  });

  it('is false when a required multiple-select group has no options chosen', () => {
    expect(hasRequiredSelections(bowlWithRequiredExtras, [])).toBe(false);
  });

  it('is false when a required multiple-select group has an empty optionIds array', () => {
    expect(hasRequiredSelections(bowlWithRequiredExtras, [{ groupId: 'toppings', optionIds: [] }])).toBe(false);
  });

  it('is true when a required multiple-select group has at least one option chosen', () => {
    expect(hasRequiredSelections(bowlWithRequiredExtras, [{ groupId: 'toppings', optionIds: ['topping-mango'] }])).toBe(
      true
    );
  });

  it('is true for an item with no modifier groups at all', () => {
    const plainItem: MenuItem = { ...burger, modifierGroups: undefined };
    expect(hasRequiredSelections(plainItem, [])).toBe(true);
  });
});
