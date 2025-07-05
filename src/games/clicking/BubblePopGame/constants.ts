import { BubbleStarLevel } from './types';

export const BUBBLE_STAR_LEVELS: BubbleStarLevel[] = [
  {
    star: 1,
    target: 5,
    bubbleCount: 3,
    bubbleSpeed: 2,
    bubbleSize: { min: 60, max: 80 },
    spawnRate: 2000,
    description: 'จับฟองสบู่ 5 ฟอง'
  },
  {
    star: 2,
    target: 10,
    bubbleCount: 4,
    bubbleSpeed: 3,
    bubbleSize: { min: 50, max: 70 },
    spawnRate: 1800,
    description: 'จับฟองสบู่ 10 ฟอง'
  },
  {
    star: 3,
    target: 15,
    bubbleCount: 5,
    bubbleSpeed: 4,
    bubbleSize: { min: 40, max: 60 },
    spawnRate: 1500,
    description: 'จับฟองสบู่ 15 ฟอง'
  },
  {
    star: 4,
    target: 20,
    bubbleCount: 6,
    bubbleSpeed: 5,
    bubbleSize: { min: 35, max: 55 },
    spawnRate: 1200,
    description: 'จับฟองสบู่ 20 ฟอง'
  },
  {
    star: 5,
    target: 25,
    bubbleCount: 7,
    bubbleSpeed: 6,
    bubbleSize: { min: 30, max: 50 },
    spawnRate: 1000,
    description: 'จับฟองสบู่ 25 ฟอง'
  }
];
