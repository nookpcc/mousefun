import { Gem, TrailPoint } from './types';
import { TRAIL_CONFIG, GEM_CONFIG, GEM_COLORS, GAME_AREA } from './constants';
import { generateId, getRandomColor, getRandomSize, calculateDistance } from '../../shared/gameUtils';
import { GamePosition } from '../../shared/types';

export const createGem = (existingGems: Gem[] = []): Gem => {
  const size = getRandomSize(GEM_CONFIG.MIN_SIZE, GEM_CONFIG.MAX_SIZE);
  const color = getRandomColor(GEM_COLORS);
  
  let position: GamePosition;
  let attempts = 0;
  
  do {
    position = {
      x: Math.random() * (GAME_AREA.width - size - GEM_CONFIG.SPAWN_PADDING * 2) + GEM_CONFIG.SPAWN_PADDING,
      y: Math.random() * (GAME_AREA.height - size - GEM_CONFIG.SPAWN_PADDING * 2) + GEM_CONFIG.SPAWN_PADDING + 60
    };
    attempts++;
  } while (
    attempts < 20 && 
    existingGems.some(gem => 
      !gem.collected && 
      calculateDistance(position, gem.position) < size + (gem.size || 30) + 20
    )
  );
  
  return {
    id: generateId(),
    type: 'gem',
    position,
    size,
    color,
    collected: false,
    glowIntensity: Math.random() * 0.5 + 0.5,
    sparkleOffset: Math.random() * Math.PI * 2,
    isActive: true
  };
};

export const generateGems = (count: number): Gem[] => {
  const gems: Gem[] = [];
  
  for (let i = 0; i < count; i++) {
    const gem = createGem(gems);
    gems.push(gem);
  }
  
  return gems;
};

export const checkGemCollection = (
  mousePos: GamePosition, 
  gem: Gem
): boolean => {
  if (gem.collected || !gem.isActive) return false;
  const gemCenter = {
    x: gem.position.x + (gem.size || 30) / 2,
    y: gem.position.y + (gem.size || 30) / 2
  };
  return calculateDistance(mousePos, gemCenter) <= TRAIL_CONFIG.COLLECTION_DISTANCE;
};

export const updateMouseTrail = (
  currentTrail: TrailPoint[],
  mousePos: GamePosition
): TrailPoint[] => {
  const now = Date.now();
  
  // Add new point
  const newTrail: TrailPoint[] = [
    { 
      x: mousePos.x, 
      y: mousePos.y, 
      opacity: 1, 
      timestamp: now 
    },
    ...currentTrail
  ];
  
  // Remove old points and update opacity
  return newTrail
    .filter(point => now - point.timestamp < TRAIL_CONFIG.FADE_DURATION)
    .slice(0, TRAIL_CONFIG.MAX_LENGTH)
    .map(point => ({
      ...point,
      opacity: Math.max(0, 1 - (now - point.timestamp) / TRAIL_CONFIG.FADE_DURATION)
    }));
};
