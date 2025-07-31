import { GamePosition, GameBounds } from './types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getRandomPosition = (bounds: GameBounds): GamePosition => {
  return {
    x: Math.random() * (bounds.right - bounds.left) + bounds.left,
    y: Math.random() * (bounds.bottom - bounds.top) + bounds.top
  };
};

export const getRandomSize = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const calculateDistance = (pos1: GamePosition, pos2: GamePosition): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const isPointInBounds = (point: GamePosition, bounds: GameBounds): boolean => {
  return point.x >= bounds.left && 
         point.x <= bounds.right && 
         point.y >= bounds.top && 
         point.y <= bounds.bottom;
};

export const clampPosition = (position: GamePosition, bounds: GameBounds): GamePosition => {
  return {
    x: Math.max(bounds.left, Math.min(position.x, bounds.right)),
    y: Math.max(bounds.top, Math.min(position.y, bounds.bottom))
  };
};

export const getRandomColor = (colors: string[]): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const easeInOut = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
