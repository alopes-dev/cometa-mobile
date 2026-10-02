/**
 * Every string the Home screen renders, transcribed from the board
 * (node 48:19762, "Home — António com pedido ativo").
 *
 * Kept out of the components for the same reason the onboarding flow keeps
 * its copy in one file: the board is the source of truth for wording, and a
 * reviewer comparing the two should not have to open six components to do it.
 */
export const home = {
  /** Header, node 48:19769. */
  deliverTo: 'Entregar em',
  notifications: 'Notificações',
  cart: 'Cesta',

  /** Search entry, node 48:22537. */
  searchPlaceholder: 'O que estás à procura?',

  /** Active order, node 48:19785. */
  trackOrder: 'Acompanhar pedido →',

  /** Section titles, with the "Ver tudo" action the board gives each one. */
  seeAll: 'Ver tudo',
  cravings: 'O que te apetece?',
  forYou: 'Para ti',
  popularNearby: 'Popular perto de ti',
  offers: 'Ofertas para ti',
  nearby: 'Perto de ti',
  orderAgain: 'Pedir novamente',

  /** "Pedir novamente" replaces the delivery meta with the last total. */
  lastOrder: 'Último pedido',

  /** Assistant, node 48:19921. */
  assistantTitle: 'Hi Cometa',
  assistantBody: 'Ainda com fome? Tenho ideias rápidas para ti.',

  /** Shown in place of the sections when a search returns nothing. */
  noResults: 'Sem resultados para esta procura.',
} as const;
