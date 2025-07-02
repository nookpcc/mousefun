import { GamePosition, GameBounds } from './types';
import { GAME_BOUNDS } from './constants';

// Utility functions for games
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getRandomPosition = (bounds: GameBounds = {
  left: GAME_BOUNDS.PADDING,
  right: GAME_BOUNDS.WIDTH - GAME_BOUNDS.PADDING,
  top: GAME_BOUNDS.PADDING,
  bottom: GAME_BOUNDS.HEIGHT - GAME_BOUNDS.PADDING
}): GamePosition => {
  return {
    x: Math.random() * (bounds.right - bounds.left) + bounds.left,
    y: Math.random() * (bounds.bottom - bounds.top) + bounds.top
  };
};

export const getRandomColor = (colors: string[]): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getRandomSize = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const isColliding = (
  pos1: GamePosition, 
  size1: number, 
  pos2: GamePosition, 
  size2: number
): boolean => {
  const distance = Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
  );
  return distance < (size1 + size2) / 2;
};

export const isWithinBounds = (
  position: GamePosition, 
  size: number, 
  bounds: GameBounds = {
    left: 0,
    right: GAME_BOUNDS.WIDTH,
    top: 0,
    bottom: GAME_BOUNDS.HEIGHT
  }
): boolean => {
  const halfSize = size / 2;
  return (
    position.x - halfSize >= bounds.left &&
    position.x + halfSize <= bounds.right &&
    position.y - halfSize >= bounds.top &&
    position.y + halfSize <= bounds.bottom
  );
};

export const clampPosition = (
  position: GamePosition, 
  size: number, 
  bounds: GameBounds = {
    left: 0,
    right: GAME_BOUNDS.WIDTH,
    top: 0,
    bottom: GAME_BOUNDS.HEIGHT
  }
): GamePosition => {
  const halfSize = size / 2;
  return {
    x: Math.max(bounds.left + halfSize, Math.min(bounds.right - halfSize, position.x)),
    y: Math.max(bounds.top + halfSize, Math.min(bounds.bottom - halfSize, position.y))
  };
};

export const calculateDistance = (pos1: GamePosition, pos2: GamePosition): number => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

export const normalizeVector = (vector: GamePosition): GamePosition => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
};

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const lerpPosition = (start: GamePosition, end: GamePosition, factor: number): GamePosition => {
  return {
    x: lerp(start.x, end.x, factor),
    y: lerp(start.y, end.y, factor)
  };
};