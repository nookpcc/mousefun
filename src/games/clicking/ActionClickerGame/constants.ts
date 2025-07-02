import { ActionClickerLevel } from './types';

export const MISS_PENALTY = -5;

export const ACTION_CLICKER_STAR_LEVELS: ActionClickerLevel[] = [
  {
    level: 1,
    target: 5, // Number of targets to hit
    targetCount: 2, // Max targets on screen
    spawnRate: 1500, // ms
    minSize: 60,
    maxSize: 80,
    minPoints: 10,
    maxPoints: 20,
    description: 'Click 5 targets with correct button',
  },
  {
    level: 2,
    target: 10,
    targetCount: 3,
    spawnRate: 1200,
    minSize: 50,
    maxSize: 70,
    minPoints: 15,
    maxPoints: 25,
    description: 'Click 10 targets with correct button',
  },
  {
    level: 3,
    target: 15,
    targetCount: 4,
    spawnRate: 1000,
    minSize: 40,
    maxSize: 60,
    minPoints: 20,
    maxPoints: 30,
    description: 'Click 15 targets with correct button',
  },
  {
    level: 4,
    target: 20,
    targetCount: 5,
    spawnRate: 800,
    minSize: 30,
    maxSize: 50,
    minPoints: 25,
    maxPoints: 35,
    description: 'Click 20 targets with correct button',
  },
  {
    level: 5,
    target: 25,
    targetCount: 6,
    spawnRate: 600,
    minSize: 20,
    maxSize: 40,
    minPoints: 30,
    maxPoints: 40,
    description: 'Click 25 targets with correct button',
  },
];