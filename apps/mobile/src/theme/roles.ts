import type { SemanticColors } from './semantic';

/**
 * Flat role vocabularies for the primitives.
 *
 * `Text` and `Icon` take a role name, not a token path. Deriving their prop
 * type from `keyof colors` would expose namespaces (`background`, `status`,
 * `promo`) as if they were colors; these maps expose exactly the roles a
 * foreground or a fill is allowed to take, so an invalid one cannot compile.
 */

/** What a `Text` or an `Icon` may be colored. */
export const foregroundRoles = (c: SemanticColors) =>
  ({
    primary: c.text.primary,
    secondary: c.text.secondary,
    tertiary: c.text.tertiary,
    muted: c.text.muted,
    disabled: c.text.disabled,
    inverse: c.text.inverse,
    onBrand: c.text.onBrand,
    onMedia: c.text.onMedia,
    brand: c.text.brand,
    success: c.text.success,
    error: c.text.error,
    warning: c.text.warning,
    info: c.text.info,
    link: c.text.link,
    rating: c.rating.filled,
    ratingEmpty: c.rating.empty,
  }) as const;

export type ForegroundRole = keyof ReturnType<typeof foregroundRoles>;

/** What a badge, dot or indicator may be filled with. */
export const fillRoles = (c: SemanticColors) =>
  ({
    brand: c.brand.base,
    neutral: c.surface.disabled,
    success: c.status.success.fill,
    error: c.status.error.fill,
    warning: c.status.warning.fill,
    info: c.status.info.fill,
  }) as const;

export type FillRole = keyof ReturnType<typeof fillRoles>;
