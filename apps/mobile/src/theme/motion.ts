/**
 * Motion.
 *
 * Durations are shared so that unrelated animations across the app still feel
 * like one system. `spring` matches the HIG-style spring the previous system
 * used, kept identical so existing transitions are not re-tuned by this pass.
 */
export const motion = {
  duration: {
    /** State feedback: press, toggle, selection. */
    instant: 120,
    quick: 200,
    /** Element enter/exit. */
    base: 280,
    /** Large surfaces: sheets, screen transitions. */
    slow: 420,
    hero: 600,
  },
  spring: { damping: 0.8, response: 0.4 },
  stagger: 60,
} as const;

/** Resting-to-pressed transform applied by every tappable primitive. */
export const pressed = { opacity: 0.85, scale: 0.98 } as const;

export const opacity = {
  0: 0,
  10: 0.1,
  20: 0.2,
  40: 0.4,
  60: 0.6,
  80: 0.8,
  100: 1,
} as const;
