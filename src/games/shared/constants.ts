// Shared constants for all games
export const GAME_BOUNDS = {
  WIDTH: 728,
  HEIGHT: 400, // Excluding navigation area
  PADDING: 20
} as const;

export const STAR_LEVELS = {
  MIN: 1,
  MAX: 5
} as const;

export const COLORS = {
  PRIMARY: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
  PASTEL: ['#fecaca', '#bfdbfe', '#a7f3d0', '#fde68a', '#ddd6fe', '#fbcfe8'],
  BRIGHT: ['#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777']
} as const;

export const ANIMATIONS = {
  QUICK: { duration: 0.2 },
  NORMAL: { duration: 0.3 },
  SLOW: { duration: 0.5 },
  BOUNCE: { type: "spring", stiffness: 200 },
  EASE_OUT: { ease: "easeOut" }
} as const;

export const GAME_SETTINGS = {
  ENTITY_CLEANUP_INTERVAL: 1000,
  PARTICLE_MAX_COUNT: 50,
  STAR_ANIMATION_DELAY: 0.1
} as const;