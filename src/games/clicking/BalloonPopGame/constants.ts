import { BalloonPopStarLevel } from './types';

export const BALLOON_POP_STAR_LEVELS: BalloonPopStarLevel[] = [
  {
    star: 1,
    target: 5,
    balloonSize: { min: 80, max: 100 },
    balloonSpeed: { min: 1, max: 2 },
    spawnRate: 2000, // 2 seconds
    timeLimit: 0,
    description: 'แตกลูกโป่ง 5 ลูก'
  },
  {
    star: 2,
    target: 8,
    balloonSize: { min: 70, max: 90 },
    balloonSpeed: { min: 1.5, max: 2.5 },
    spawnRate: 1800,
    timeLimit: 0,
    description: 'แตกลูกโป่ง 8 ลูก'
  },
  {
    star: 3,
    target: 12,
    balloonSize: { min: 60, max: 80 },
    balloonSpeed: { min: 2, max: 3 },
    spawnRate: 1500,
    timeLimit: 0,
    description: 'แตกลูกโป่ง 12 ลูก'
  },
  {
    star: 4,
    target: 15,
    balloonSize: { min: 50, max: 70 },
    balloonSpeed: { min: 2.5, max: 3.5 },
    spawnRate: 1200,
    timeLimit: 0,
    description: 'แตกลูกโป่ง 15 ลูก'
  },
  {
    star: 5,
    target: 20,
    balloonSize: { min: 40, max: 60 },
    balloonSpeed: { min: 3, max: 4 },
    spawnRate: 1000,
    timeLimit: 0,
    description: 'แตกลูกโป่ง 20 ลูก'
  }
];

export const BALLOON_COLORS = [
  '#ff6b6b', // Red
  '#4ecdc4', // Cyan
  '#45b7d1', // Blue
  '#96ceb4', // Green
  '#ffeaa7', // Yellow
  '#dda0dd', // Plum
  '#98d8c8', // Mint
  '#f9ca24'  // Orange
];

export const GAME_AREA = {
  width: 728,
  height: 400
};