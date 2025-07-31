import { Balloon } from './types';
import { BALLOON_COLORS, BALLOON_CONFIG, GAME_AREA } from './constants';
import { generateId, getRandomColor, getRandomSize, calculateDistance } from '../../shared/gameUtils';

export const createBalloon = (difficultyMultiplier: number = 1): Balloon => {
  const size = getRandomSize(BALLOON_CONFIG.MIN_SIZE, BALLOON_CONFIG.MAX_SIZE / difficultyMultiplier);
  const speed = BALLOON_CONFIG.FLOAT_SPEED * difficultyMultiplier;
  const color = getRandomColor([...BALLOON_COLORS]);
  
  return {
    id: generateId(),
    type: 'balloon',
    position: {
      x: Math.random() * (GAME_AREA.width - size),
      y: GAME_AREA.height + size // Start below screen to float up
    },
    size,
    color,
    speed,
    direction: -1, // Float upward
    popped: false,
    isActive: true
  };
};

export const updateBalloons = (balloons: Balloon[]): Balloon[] => {
  return balloons
    .map(balloon => ({
      ...balloon,
      position: {
        ...balloon.position,
        y: balloon.position.y + (balloon.speed * balloon.direction)
      }
    }))
    .filter(balloon => 
      balloon.isActive && 
      !balloon.popped && 
      balloon.position.y > -(balloon.size || 50)
    );
};

export const checkBalloonClick = (
  mousePos: { x: number; y: number },
  balloon: Balloon
): boolean => {
  const centerX = balloon.position.x + (balloon.size || 50) / 2;
  const centerY = balloon.position.y + (balloon.size || 50) / 2;
  const radius = (balloon.size || 50) / 2;
  
  const distance = calculateDistance(mousePos, { x: centerX, y: centerY });
  return distance <= radius;
};