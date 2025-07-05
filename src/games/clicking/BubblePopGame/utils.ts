import { Bubble, BubbleStarLevel } from './types';
import { GAME_BOUNDS } from '../../shared/constants';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateBubble = (level: BubbleStarLevel): Bubble => {
  const size = Math.random() * (level.bubbleSize.max - level.bubbleSize.min) + level.bubbleSize.min;
  const x = Math.random() * (GAME_BOUNDS.WIDTH - size);
  const y = Math.random() * (GAME_BOUNDS.HEIGHT - size);
  
  return {
    id: generateId(),
    x,
    y,
    position: { x, y },
    size,
    speed: level.bubbleSpeed,
  };
};

export const shouldSpawnBubble = (bubbles: Bubble[], maxCount: number): boolean => {
  return bubbles.length < maxCount;
};
