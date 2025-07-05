import { GamePosition } from '../../shared/types';
import { Fruit, FruitCatchStarLevel } from './types';
import { GAME_BOUNDS } from '../../shared/constants';

// Generate random size for fruits
export const getRandomSize = (): number => {
  return Math.random() * 30 + 20; // Random size between 20-50
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateFruit = (level: FruitCatchStarLevel): Fruit => {
  const size = Math.random() * (level.fruitSize.max - level.fruitSize.min) + level.fruitSize.min;
  const x = Math.random() * (GAME_BOUNDS.WIDTH - size);
  
  return {
    id: generateId(),
    position: { x, y: -size },
    size,
    speed: level.fruitSpeed,
    type: Math.floor(Math.random() * 4),
    isCaught: false
  };
};

export const shouldSpawnFruit = (lastSpawn: number, spawnRate: number): boolean => {
  return Date.now() - lastSpawn > spawnRate;
};

export const isFruitCaught = (fruit: Fruit, catcherPos: GamePosition, catcherWidth: number, catcherHeight: number): boolean => {
  return (
    fruit.position.x < catcherPos.x + catcherWidth &&
    fruit.position.x + fruit.size > catcherPos.x &&
    fruit.position.y < catcherPos.y + catcherHeight &&
    fruit.position.y + fruit.size > catcherPos.y
  );
};

export const updateFruitPositions = (fruits: Fruit[], speed: number): Fruit[] => {
  return fruits.map(fruit => ({
    ...fruit,
    position: {
      ...fruit.position,
      y: fruit.position.y + speed
    }
  }));
};

export const isFruitOffScreen = (fruit: Fruit): boolean => {
  return fruit.position.y > GAME_BOUNDS.HEIGHT;
};

export const createFruit = (bounds: any, type?: number): any => {
  const x = Math.random() * (bounds.width - 50);
  const size = getRandomSize();
  
  return {
    id: generateId(),
    x,
    y: -size,
    size,
    speed: Math.random() * 3 + 2,
    type: type || Math.floor(Math.random() * 4),
  };
};
