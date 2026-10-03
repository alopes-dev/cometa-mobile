import type { Restaurant } from '@/features/home/types';
import { restaurantPhoto } from './assets';
import type { BroadCategory, NearbyPin } from './types';

/**
 * "Comida e compras" — node 48:20267.
 *
 * Six verticals, in the board's reading order. Each icon is the closest SF
 * Symbol to the Lucide glyph the board draws, with an Ionicon beside it for
 * Android, which is the pairing `Icon` expects.
 */
export const mockBroadCategories: BroadCategory[] = [
  { id: 'comida', label: 'Comida', icon: { name: 'restaurant-outline', sf: 'fork.knife' } },
  {
    id: 'supermercado',
    label: 'Supermercado',
    icon: { name: 'basket-outline', sf: 'basket.fill' },
  },
  { id: 'farmacia', label: 'Farmácia', icon: { name: 'medkit-outline', sf: 'cross.case.fill' } },
  { id: 'beleza', label: 'Beleza', icon: { name: 'sparkles-outline', sf: 'sparkles' } },
  { id: 'casa', label: 'Casa', icon: { name: 'home-outline', sf: 'house.fill' } },
  { id: 'tecnologia', label: 'Tecnologia', icon: { name: 'phone-portrait-outline', sf: 'iphone' } },
];

/**
 * The restaurants Discovery casts, written to the board's content.
 *
 * A catalogue of its own rather than a second view over Home's: the board
 * puts five merchants here that Home never shows, and the one name they share
 * — Forno 27 — carries a different locality and a different photograph
 * (node 48:20325 says Alvalade, node 48:19861 says Morro Bento). Folding them
 * together would have to pick one and silently redraw the other screen.
 *
 * Every card reads "★ 4,8 · 25–35 min · 1.000 Kz" on the board, which is the
 * placeholder a design file uses before real data exists; the rating, the
 * window and the fee below are what produce that line through
 * `home/format.ts`, so when real data lands the formatting is already right.
 */
export const mockDiscoveryRestaurants: Restaurant[] = [
  {
    id: 'd1',
    name: 'Bun Lab Luanda',
    imageUrl: restaurantPhoto.bunLabLuanda,
    rating: 4.8,
    cuisine: 'Smash burgers',
    deliveryTimeMinutes: 25,
    deliveryFee: 1000,
    description: 'Smash burgers prensados na chapa, no Morro Bento.',
    distanceKm: 1.5,
    reviewCount: 612,
    minOrderValue: 4000,
    reviews: [{ id: 'd1-rev1', author: 'Vando', rating: 5, comment: 'O smash é mesmo prensado como deve ser. Pão fofo.' }],
    neighbourhood: 'Morro Bento',
  },
  {
    id: 'd2',
    name: 'Nori 244',
    imageUrl: restaurantPhoto.nori244,
    rating: 4.8,
    cuisine: 'Sushi',
    deliveryTimeMinutes: 25,
    deliveryFee: 1000,
    description: 'Sushi preparado à hora, na Ingombota.',
    distanceKm: 2.1,
    reviewCount: 431,
    minOrderValue: 7500,
    reviews: [{ id: 'd2-rev1', author: 'Cátia', rating: 5, comment: 'Sushi fresco e bem apresentado. Chegou gelado.' }],
    neighbourhood: 'Ingombota',
    hasPromotion: true,
    promotionLabel: '-15%',
  },
  {
    id: 'd3',
    name: 'Forno 27',
    imageUrl: restaurantPhoto.forno27,
    rating: 4.8,
    cuisine: 'Pizza',
    deliveryTimeMinutes: 25,
    deliveryFee: 1000,
    description: 'Pizza de forno a lenha, no Alvalade.',
    distanceKm: 1.8,
    reviewCount: 1032,
    minOrderValue: 4000,
    reviews: [{ id: 'd3-rev1', author: 'Hélder', rating: 4, comment: 'Massa fina e bem assada. Já é a minha pizzaria.' }],
    neighbourhood: 'Alvalade',
  },
  {
    id: 'd4',
    name: 'Kwanza Bowl',
    imageUrl: restaurantPhoto.kwanzaBowl,
    rating: 4.8,
    cuisine: 'Bowls',
    deliveryTimeMinutes: 25,
    deliveryFee: 1000,
    description: 'Bowls equilibrados com produto fresco, em Talatona.',
    distanceKm: 1.2,
    reviewCount: 288,
    minOrderValue: 4500,
    reviews: [{ id: 'd4-rev1', author: 'Jorge', rating: 5, comment: 'Bowls bem compostos e ingredientes frescos.' }],
    neighbourhood: 'Talatona',
  },
  {
    id: 'd5',
    name: 'Doce Kilamba',
    imageUrl: restaurantPhoto.doceKilamba,
    rating: 4.8,
    cuisine: 'Pastelaria',
    deliveryTimeMinutes: 25,
    deliveryFee: 1000,
    description: 'Bolos e doces feitos de manhã, no Kilamba.',
    distanceKm: 3.2,
    reviewCount: 357,
    minOrderValue: 3000,
    reviews: [{ id: 'd5-rev1', author: 'Neusa', rating: 5, comment: 'Os doces são caseiros mesmo, dá para notar.' }],
    neighbourhood: 'Kilamba',
    hasPromotion: true,
    promotionLabel: '-25%',
  },
];

/**
 * The three merchant pins on the "Nearby" preview (nodes 48:20363, 48:20365,
 * 48:20367), converted from the board's 390x180 card to fractions of it.
 */
export const mockNearbyPins: NearbyPin[] = [
  { id: 'p1', x: 40 / 390, y: 40 / 180 },
  { id: 'p2', x: 150 / 390, y: 70 / 180 },
  { id: 'p3', x: 280 / 390, y: 100 / 180 },
];
