import type { RatingCriterion } from './types';

export const RESTAURANT_CRITERIA: RatingCriterion[] = [
  { key: 'quality', label: 'Qualidade' },
  { key: 'taste', label: 'Sabor' },
  { key: 'packaging', label: 'Embalagem' },
  { key: 'prepTime', label: 'Tempo de preparação' },
];

export const DRIVER_CRITERIA: RatingCriterion[] = [
  { key: 'punctuality', label: 'Pontualidade' },
  { key: 'friendliness', label: 'Cordialidade' },
  { key: 'careWithOrder', label: 'Cuidado com o pedido' },
];
