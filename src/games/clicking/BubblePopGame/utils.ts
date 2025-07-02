import { Bubble, BubbleStarLevel } from './types';
import { BUBBLE_COLORS } from './constants';
import { generateId, getRandomSize } from '../../shared/gameUtils';
import { GAME_BOUNDS } from '../../shared/constants';

export const generateBubble = (level: BubbleStarLevel): Bubble => {
  const size = getRandomSize(level.bubbleSize.min, level.bubbleSize.max);
  
  return {
    id: generateId(),
    position: {
      x: Math.random() * (GAME_BOUNDS.WIDTH - size - 100) + 50,
      y: Math.random() * (GAME_BOUNDS.HEIGHT - size - 100) + 50
    },
    size,
    speed: level.bubbleSpeed,
    color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
    isActive: true
  };
};

export const shouldSpawnBubble = (currentBubbles: Bubble[], maxBubbles: number): boolean => {
  return currentBubbles.length < maxBubbles;
};

export const isOldBubble = (bubble: Bubble, currentTime: number): boolean => {
  const bubbleAge = currentTime - parseInt(bubble.id, 36);
  return bubbleAge > 8000; // 8 seconds
};