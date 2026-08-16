export type Restaurant = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  cuisine: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  description: string;
  distanceKm: number;
  hasPromotion?: boolean;
};

export type ModifierOption = {
  id: string;
  label: string;
  priceDelta: number;
};

export type ModifierGroup = {
  id: string;
  label: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: ModifierOption[];
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  modifierGroups?: ModifierGroup[];
};

export type Offer = {
  id: string;
  imageUrl: string;
  badgeLabel: string;
  title: string;
  subtitle: string;
};
