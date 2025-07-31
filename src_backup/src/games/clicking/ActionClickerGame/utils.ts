import { Target, ActionClickerLevel, ClickType } from './types';
import { GAME_BOUNDS } from '../../shared/constants';

const HEADER_HEIGHT = 80; // Estimated height of the top banner with title and stars

export const generateTarget = (level: ActionClickerLevel): Target => {
  const size = Math.floor(Math.random() * (level.maxSize - level.minSize + 1)) + level.minSize;
  const x = Math.random() * (GAME_BOUNDS.WIDTH - size);
  // Ensure target spawns below the header area
  const y = HEADER_HEIGHT + (Math.random() * (GAME_BOUNDS.HEIGHT - size - HEADER_HEIGHT));
  const clickType: ClickType = Math.random() < 0.5 ? 'left' : 'right';
  const points = Math.floor(Math.random() * (level.maxPoints - level.minPoints + 1)) + level.minPoints;

  return {
    id: `target-${Date.now()}-${Math.random()}`,
    position: { x, y },
    size,
    clickType,
    isHit: false,
    isActive: true,
    points,
  };
};

export const shouldSpawnTarget = (currentTargets: Target[], maxTargets: number): boolean => {
  return currentTargets.filter(t => t.isActive).length < maxTargets;
};

export const updateTargetLifetime = (target: Target): Target => {
  // For ActionClickerGame, targets don't have a lifetime that makes them disappear
  // They only disappear when hit or when a new level starts
  return target;
};
