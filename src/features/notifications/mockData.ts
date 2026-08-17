import type { AppNotification, NotificationCategory, NotificationCategoryMeta } from './types';

export const NOTIFICATION_CATEGORY_META: Record<NotificationCategory, NotificationCategoryMeta> = {
  promo: { icon: { name: 'pricetag-outline', sf: 'tag' } },
  order: { icon: { name: 'bag-check-outline', sf: 'checkmark.seal' } },
  system: { icon: { name: 'information-circle-outline', sf: 'info.circle' } },
};

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    category: 'promo',
    title: '50% Off em Pizzas',
    message: 'A sua oferta favorita está de volta hoje.',
    timestamp: '2 min atrás',
    group: 'Hoje',
    read: false,
  },
  {
    id: 'n2',
    category: 'order',
    title: 'Pedido entregue',
    message: 'O seu pedido do Yakuza Sushi Bar foi entregue.',
    timestamp: '1 h atrás',
    group: 'Hoje',
    read: false,
  },
  {
    id: 'n3',
    category: 'order',
    title: 'Pedido a caminho',
    message: 'O entregador está a caminho da sua morada.',
    timestamp: '3 h atrás',
    group: 'Hoje',
    read: true,
  },
  {
    id: 'n4',
    category: 'promo',
    title: 'Entrega grátis este fim de semana',
    message: 'Peça em qualquer restaurante e não pague entrega.',
    timestamp: 'Ontem',
    group: 'Esta semana',
    read: true,
  },
  {
    id: 'n5',
    category: 'system',
    title: 'Bem-vindo ao Cometa',
    message: 'Explore restaurantes perto de si e peça já.',
    timestamp: 'Há 4 dias',
    group: 'Esta semana',
    read: true,
  },
];
