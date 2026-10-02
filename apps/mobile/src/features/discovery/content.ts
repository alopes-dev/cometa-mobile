/**
 * Every string the Discovery screen renders, transcribed from the board
 * (frame 48:20245, "Descobrir").
 *
 * Same contract as `features/home/content.ts`: the board is the source of
 * truth for wording, and a reviewer comparing the two should not have to open
 * six components to do it.
 *
 * The five feed headings are left in English because that is how the board
 * writes them (nodes 48:20288, 48:20315, 48:20329, 48:20343, 48:20359), even
 * though the chrome around them is Portuguese. Transcribing rather than
 * translating keeps the diff against the design readable; if they should be
 * Portuguese, that is a change to make on the board first.
 */
export const discovery = {
  /** Header, node 48:20252. */
  title: 'Descobrir',
  subtitle: 'Encontra algo novo hoje.',
  notifications: 'Notificações',
  unreadNotifications: 'Tens notificações por ler',

  /** Search entry, node 48:20261. */
  searchPlaceholder: 'O que estás à procura?',

  /** The action every feed section carries, node 48:20289. */
  seeAll: 'Ver tudo',

  /** Section titles, in the board's order. */
  broadCategories: 'Comida e compras',
  trending: 'Trending',
  popular: 'Popular',
  newOnCometa: 'New on Cometa',
  offers: 'Offers',
  nearby: 'Nearby',

  /** Nearby map card, nodes 48:20363 and 48:20370. */
  openMap: 'Ver mapa',
  merchantPin: 'Loja perto de ti',
} as const;
