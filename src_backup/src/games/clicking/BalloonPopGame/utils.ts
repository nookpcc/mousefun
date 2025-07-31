import { Balloon, BalloonPopStarLevel } from './types';
import { BALLOON_COLORS, GAME_AREA } from './constants';

export const generateBalloonId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createBalloon = (level: BalloonPopStarLevel): Balloon => {
  const size = Math.random() * (level.balloonSize.max - level.balloonSize.min) + level.balloonSize.min;
  const speed = Math.random() * (level.balloonSpeed.max - level.balloonSpeed.min) + level.balloonSpeed.min;
  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  
  return {
    id: generateBalloonId(),
    position: {
      x: Math.random() * (GAME_AREA.width - size),
      y: GAME_AREA.height + size // Start below screen to float up
    },
    size,
    color,
    speed,
    popped: false,
    created: Date.now()
  };
};

export const updateBalloons = (balloons: Balloon[]): Balloon[] => {
  return balloons
    .map(balloon => ({
      ...balloon,
      position: {
        ...balloon.position,
        y: balloon.position.y - balloon.speed
      }
    }))
    .filter(balloon => !balloon.popped && balloon.position.y > -balloon.size);
};

export const checkBalloonClick = (
  mousePos: { x: number; y: number },
  balloon: Balloon
): boolean => {
  const centerX = balloon.position.x + balloon.size / 2;
  const centerY = balloon.position.y + balloon.size / 2;
  const radius = balloon.size / 2;
  
  const distance = Math.sqrt(
    Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2)
  );
  
  return distance <= radius;
};

export const shouldSpawnBalloon = (
  lastSpawn: number,
  spawnRate: number
): boolean => {
  return Date.now() - lastSpawn >= spawnRate;
};