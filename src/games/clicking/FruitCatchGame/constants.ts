import { FruitCatchStarLevel } from './types';

export const FRUIT_FALL_INTERVAL = 16; // ~60fps
export const CATCHER_WIDTH = 100;
export const CATCHER_HEIGHT = 60;

export const FRUIT_CATCH_STAR_LEVELS: FruitCatchStarLevel[] = [
  {
    star: 1,
    target: 5,
    fruitCount: 5,
    fruitSpeed: 2,
    fruitSize: { min: 40, max: 60 },
    spawnRate: 2000,
    description: 'จับผลไม้ 5 ผล'
  },
  {
    star: 2,
    target: 10,
    fruitCount: 10,
    fruitSpeed: 3,
    fruitSize: { min: 35, max: 55 },
    spawnRate: 1800,
    description: 'จับผลไม้ 10 ผล'
  },
  {
    star: 3,
    target: 15,
    fruitCount: 15,
    fruitSpeed: 4,
    fruitSize: { min: 30, max: 50 },
    spawnRate: 1500,
    description: 'จับผลไม้ 15 ผล'
  },
  {
    star: 4,
    target: 20,
    fruitCount: 20,
    fruitSpeed: 5,
    fruitSize: { min: 25, max: 45 },
    spawnRate: 1200,
    description: 'จับผลไม้ 20 ผล'
  },
  {
    star: 5,
    target: 25,
    fruitCount: 25,
    fruitSpeed: 6,
    fruitSize: { min: 20, max: 40 },
    spawnRate: 1000,
    description: 'จับผลไม้ 25 ผล'
  }
];
