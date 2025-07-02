import { MouseTrailStarLevel } from './types';

export const MOUSE_TRAIL_STAR_LEVELS: MouseTrailStarLevel[] = [
  {
    star: 1,
    target: 3,
    starCount: 3,
    starSize: { min: 50, max: 60 },
    timeLimit: 0, // No time limit
    spawnDelay: 0,
    description: 'เลื่อนเมาส์เก็บเพชร 3 เม็ด'
  },
  {
    star: 2,
    target: 4,
    starCount: 4,
    starSize: { min: 45, max: 55 },
    timeLimit: 0,
    spawnDelay: 0,
    description: 'เก็บเพชร 4 เม็ด'
  },
  {
    star: 3,
    target: 5,
    starCount: 5,
    starSize: { min: 40, max: 50 },
    timeLimit: 0,
    spawnDelay: 0,
    description: 'เก็บเพชร 5 เม็ด'
  },
  {
    star: 4,
    target: 6,
    starCount: 6,
    starSize: { min: 35, max: 45 },
    timeLimit: 0,
    spawnDelay: 0,
    description: 'เก็บเพชร 6 เม็ด'
  },
  {
    star: 5,
    target: 7,
    starCount: 7,
    starSize: { min: 30, max: 40 },
    timeLimit: 0,
    spawnDelay: 0,
    description: 'เก็บเพชร 7 เม็ด สุดท้าย!'
  }
];

export const STAR_COLORS = [
  '#ffd700', // Gold
  '#ffed4e', // Yellow  
  '#fbbf24', // Amber
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
];

export const TRAIL_LENGTH = 25;
export const COLLECTION_DISTANCE = 40; // Easier collection for kids