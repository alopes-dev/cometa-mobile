import type { Driver, TrackingStage } from './types';

export const mockDriver: Driver = {
  name: 'João Manuel',
  photoUrl: 'https://loremflickr.com/200/200/portrait,man?lock=501',
  rating: 4.9,
  vehicle: 'Honda PCX',
  plate: 'LD-23-45-AB',
  phone: '+244923456789',
  etaMinutes: 8,
};

export const TRACKING_STAGES: TrackingStage[] = [
  { key: 'confirmed', label: 'Pedido confirmado', icon: { name: 'checkmark-circle', sf: 'checkmark.circle.fill' } },
  { key: 'preparing', label: 'Restaurante preparando', icon: { name: 'restaurant-outline', sf: 'fork.knife' } },
  { key: 'ready', label: 'Pedido pronto', icon: { name: 'bag-check-outline', sf: 'checkmark.seal' } },
  { key: 'on-the-way', label: 'Entregador a caminho', icon: { name: 'bicycle-outline', sf: 'bicycle' } },
  { key: 'picked-up', label: 'Pedido recolhido', icon: { name: 'cube-outline', sf: 'shippingbox' } },
  { key: 'arriving', label: 'Chegando até você', icon: { name: 'navigate-outline', sf: 'location.fill' } },
  { key: 'delivered', label: 'Entregue', icon: { name: 'home-outline', sf: 'house' } },
];

export const DRIVER_ASSIGNED_STAGE_INDEX = 3;
export const STAGE_INTERVAL_MS = 3500;
