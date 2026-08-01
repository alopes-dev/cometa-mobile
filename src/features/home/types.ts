export type Restaurant = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  cuisine: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  description: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};
