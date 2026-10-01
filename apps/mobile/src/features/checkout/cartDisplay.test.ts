import { describeCartLine, describeSelections } from './cartDisplay';
import type { MenuItem } from '@/features/home/types';

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

describe('describeSelections', () => {
  it('joins the chosen option labels across groups', () => {
    const summary = describeSelections(burger, [
      { groupId: 'pao', optionIds: ['pao-brioche'] },
      { groupId: 'extras', optionIds: ['extra-bacon', 'extra-ovo'] },
    ]);
    expect(summary).toBe('Brioche, Bacon, Ovo');
  });

  it('returns an empty string when there are no selections', () => {
    expect(describeSelections(burger, [])).toBe('');
  });
});

describe('describeCartLine', () => {
  it('combines selections and notes', () => {
    const summary = describeCartLine(burger, [{ groupId: 'pao', optionIds: ['pao-brioche'] }], 'Sem cebola');
    expect(summary).toBe('Brioche · Sem cebola');
  });

  it('falls back to the item description when there are no selections or notes', () => {
    expect(describeCartLine(burger, [])).toBe(burger.description);
  });
});
