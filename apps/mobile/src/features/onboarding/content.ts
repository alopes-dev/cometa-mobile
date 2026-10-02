/**
 * Every string the onboarding renders, transcribed from Figma file
 * PAuqq5xMI0yQtx8POz4TUL verbatim — including the two boards' different
 * languages. "01 · Onboarding" is drawn in English, "10 — Onboarding" in
 * European Portuguese; neither is translated here, because the copy is part of
 * the design under review and silently harmonising it would hide that split.
 */

import { illustration, type CategoryIconName } from './assets';

/** Node 45:49 — the title is drawn as two explicit lines. */
export const welcome = {
  titleLines: ['Welcome to', 'Kometa! 👋'],
  description:
    'Discover delicious food from the best restaurants near you, delivered at comet speed.',
} as const;

export type ValueSlideContent = {
  id: string;
  /** Node id of the `Onboarding content` frame this slide was taken from. */
  node: string;
  image: number;
  title: string;
  description: string;
  action: string;
};

/** Nodes 45:53, 45:71, 45:89 — the three-step value story. */
export const valueSlides: readonly ValueSlideContent[] = [
  {
    id: 'order-for-food',
    node: '45:59',
    image: illustration.orderForFood,
    title: 'Order for Food',
    description:
      'Browse thousands of dishes and order exactly what you crave in just a few taps.',
    action: 'Next',
  },
  {
    id: 'easy-payment',
    node: '45:77',
    image: illustration.easyPayment,
    title: 'Easy Payment',
    description:
      'Choose your favorite secure payment method and enjoy a smooth checkout every time.',
    action: 'Next',
  },
  {
    id: 'fast-delivery',
    node: '45:95',
    image: illustration.fastDelivery,
    title: 'Fast Delivery',
    description: 'Track your order live while our trusted drivers bring it safely to your door.',
    action: 'Get Started',
  },
] as const;

/** Node 44:22383 — step 1 of 4. */
export const locationChoice = {
  title: 'Onde queres receber os teus pedidos?',
  description:
    'Usamos a tua localização para mostrar restaurantes e lojas que entregam perto de ti.',
  useCurrent: 'Usar localização atual',
  addAddress: 'Adicionar endereço',
  skip: 'Agora não',
} as const;

/**
 * Node 44:22414 — the pre-permission screen. It carries no progress bar in the
 * design, which is the point: it sits between steps 1 and 2 as context for the
 * system dialog rather than as a step of its own.
 */
export const locationPermission = {
  title: 'Encontra lugares perto de ti.',
  description:
    'Ao permitir localização, mostramos opções disponíveis na tua zona e calculamos tempos de entrega.',
  allow: 'Permitir localização',
  skip: 'Agora não',
} as const;

/** Node 44:22436 — step 2 of 4. */
export const address = {
  title: 'Adicionar endereço',
  description: 'Indica onde queres receber os teus pedidos.',
  save: 'Guardar endereço',
  fields: {
    street: { label: 'Rua / Avenida', placeholder: 'Ex.: Avenida 4 de Fevereiro' },
    number: { label: 'Número', placeholder: '12' },
    district: { label: 'Bairro', placeholder: 'Maianga' },
    city: { label: 'Cidade', placeholder: 'Luanda' },
    complement: { label: 'Complemento', placeholder: 'Bloco, andar, porta (opcional)' },
    reference: { label: 'Referência', placeholder: 'Ex.: junto ao mercado' },
  },
} as const;

/** Node 44:22490 — step 3 of 4. */
export const notifications = {
  title: 'Queres receber atualizações dos teus pedidos?',
  description:
    'Avisamos quando o restaurante confirma, o estafeta está a caminho e o pedido chega.',
  allow: 'Ativar notificações',
  skip: 'Agora não',
} as const;

export type CategoryContent = {
  id: string;
  label: string;
  icon: CategoryIconName;
};

/** Node 44:22533 — the eight categories, in the order the grid draws them. */
export const categories: readonly CategoryContent[] = [
  { id: 'fast-food', label: 'Fast Food', icon: 'sandwich' },
  { id: 'pizza', label: 'Pizza', icon: 'pizza' },
  { id: 'burger', label: 'Hambúrguer', icon: 'beef' },
  { id: 'grocery', label: 'Supermercado', icon: 'shoppingBasket' },
  { id: 'pharmacy', label: 'Farmácia', icon: 'pill' },
  { id: 'drinks', label: 'Bebidas', icon: 'cupSoda' },
  { id: 'desserts', label: 'Doces', icon: 'cakeSlice' },
  { id: 'healthy', label: 'Saudável', icon: 'salad' },
] as const;

/** Node 44:22517 — step 4 of 4. */
export const preferences = {
  title: 'O que gostas de pedir?',
  description: 'Escolhe algumas categorias. Podes alterar isto mais tarde.',
  submit: 'Continuar',
  skip: 'Pular',
} as const;

/** `Progress` is drawn with four segments on every board-10 step. */
export const SETUP_STEP_COUNT = 4;

/** Which segment each board-10 route fills, matching the drawn boards. */
export const setupStep = {
  location: 1,
  address: 2,
  notifications: 3,
  preferences: 4,
} as const;
