import { GAME_BOUNDS } from '../../shared/constants';

export const TRAIL_CONFIG = {
  MAX_LENGTH: 30,
  FADE_DURATION: 1000, // ms
  COLLECTION_DISTANCE: 35,
  TRAIL_WIDTH: 6
};

export const GEM_CONFIG = {
  MIN_SIZE: 25,
  MAX_SIZE: 45,
  SPAWN_PADDING: 50,
  GLOW_ANIMATION_SPEED: 0.02,
  SPARKLE_COUNT: 3
};

export const GEM_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Ruby Red
  '#4ECDC4', // Emerald Teal  
  '#45B7D1', // Sapphire Blue
  '#96CEB4', // Jade Green
  '#FECA57', // Topaz Yellow
  '#FF9FF3', // Amethyst Pink
  '#54A0FF'  // Diamond Blue
];

export const GAME_AREA = {
  width: GAME_BOUNDS.WIDTH,
  height: GAME_BOUNDS.HEIGHT
};
