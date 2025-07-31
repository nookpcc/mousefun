import { GAME_BOUNDS, COLORS } from '../../shared/constants';

export const BALLOON_COLORS = COLORS.PRIMARY;

export const BALLOON_CONFIG = {
  MIN_SIZE: 40,
  MAX_SIZE: 80,
  SPAWN_RATE: 800, // milliseconds
  FLOAT_SPEED: 2,
  POP_ANIMATION_DURATION: 300,
  MAX_BALLOONS: 12
};

export const GAME_AREA = {
  width: GAME_BOUNDS.WIDTH,
  height: GAME_BOUNDS.HEIGHT
};