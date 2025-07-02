import { Fruit, FruitCatchStarLevel } from './types';
import { FRUIT_EMOJIS } from './constants';
import { generateId, getRandomSize, getRandomPosition, calculateDistance } from '../../shared/gameUtils';
import { GAME_BOUNDS } from '../../shared/constants';

export const generateFruit = (level: FruitCatchStarLevel): Fruit => {
  const size = getRandomSize(level.fruitSize.min, level.fruitSize.max);
  
  return {
    id: generateId(),
    position: {
      x: Math.random() * (GAME_BOUNDS.WIDTH - size),
      y: -size // Start above the screen
    },
    size,
    speed: level.fruitSpeed,
    type: FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)],
    isActive: true
  };
};

export const shouldSpawnFruit = (currentFruits: Fruit[], maxFruits: number): boolean => {
  return currentFruits.length < maxFruits;
};

export const isFruitCaught = (
  fruit: Fruit,
  catcherPosition: { x: number; y: number },
  catcherWidth: number,
  catcherHeight: number
): boolean => {
  const fruitBottom = fruit.position.y + fruit.size;
  const fruitCenter = fruit.position.x + fruit.size / 2;

  const catcherTop = catcherPosition.y;
  const catcherLeft = catcherPosition.x;
  const catcherRight = catcherPosition.x + catcherWidth;

  return (
    fruitBottom >= catcherTop &&
    fruitCenter >= catcherLeft &&
    fruitCenter <= catcherRight
  );
};

export const updateFruitPositions = (fruits: Fruit[], speed: number): Fruit[] => {
  return fruits.map(fruit => ({
    ...fruit,
    position: { ...fruit.position, y: fruit.position.y + speed }
  }));
};

export const isFruitOffScreen = (fruit: Fruit): boolean => {
  return fruit.position.y > GAME_BOUNDS.HEIGHT;
};
