import { Star, MouseTrailStarLevel } from './types';
import { STAR_COLORS, COLLECTION_DISTANCE } from './constants';
import { generateId, getRandomPosition, getRandomSize, calculateDistance } from '../../shared/gameUtils';
import { GamePosition } from '../../shared/types';

export const generateStar = (level: MouseTrailStarLevel): Star => {
  const size = getRandomSize(level.starSize.min, level.starSize.max);
  
  return {
    id: generateId(),
    position: getRandomPosition({
      left: size / 2 + 20,
      right: 728 - size / 2 - 20,
      top: size / 2 + 60, // Account for UI
      bottom: 400 - size / 2 - 20
    }),
    size,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    collected: false,
    glowIntensity: Math.random() * 0.5 + 0.5,
    isActive: true
  };
};

export const generateAllStars = (level: MouseTrailStarLevel): Star[] => {
  const stars: Star[] = [];
  const positions: GamePosition[] = [];
  
  for (let i = 0; i < level.starCount; i++) {
    let attempts = 0;
    let star: Star;
    
    do {
      star = generateStar(level);
      attempts++;
    } while (
      attempts < 20 && 
      positions.some(pos => calculateDistance(pos, star.position) < 60)
    );
    
    stars.push(star);
    positions.push(star.position);
  }
  
  return stars;
};

export const checkStarCollection = (
  mousePos: GamePosition, 
  star: Star
): boolean => {
  if (star.collected) return false;
  return calculateDistance(mousePos, star.position) <= COLLECTION_DISTANCE;
};

export const updateTrail = (
  currentTrail: { x: number; y: number; opacity: number }[],
  mousePos: GamePosition,
  maxLength: number = 20
): { x: number; y: number; opacity: number }[] => {
  const newTrail = [
    { x: mousePos.x, y: mousePos.y, opacity: 1 },
    ...currentTrail.slice(0, maxLength - 1)
  ];
  
  return newTrail.map((point, index) => ({
    ...point,
    opacity: 1 - (index / maxLength)
  }));
};