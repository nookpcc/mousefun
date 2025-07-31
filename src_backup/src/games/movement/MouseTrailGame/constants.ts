import { MouseTrailStarLevel } from './types';

export const TRAIL_LENGTH = 20;
export const COLLECTION_DISTANCE = 30;

export const STAR_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal  
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FECA57', // Yellow
  '#FF9FF3', // Pink
  '#54A0FF', // Light Blue
];

export const MOUSE_TRAIL_STAR_LEVELS: MouseTrailStarLevel[] = [
  {
    star: 1,
    target: 3,
    starCount: 3,
    starSize: { min: 30, max: 40 },
    timeLimit: 60,
    spawnDelay: 500,
    description: 'เก็บดาว 3 ดวง'
  },
  {
    star: 2,
    target: 5,
    starCount: 5,
    starSize: { min: 25, max: 35 },
    timeLimit: 45,
    spawnDelay: 400,
    description: 'เก็บดาว 5 ดวง'
  },
  {
    star: 3,
    target: 7,
    starCount: 7,
    starSize: { min: 20, max: 30 },
    timeLimit: 40,
    spawnDelay: 300,
    description: 'เก็บดาว 7 ดวง'
  },
  {
    star: 4,
    target: 10,
    starCount: 10,
    starSize: { min: 18, max: 25 },
    timeLimit: 35,
    spawnDelay: 250,
    description: 'เก็บดาว 10 ดวง'
  },
  {
    star: 5,
    target: 15,
    starCount: 15,
    starSize: { min: 15, max: 22 },
    timeLimit: 30,
    spawnDelay: 200,
    description: 'เก็บดาว 15 ดวง'
  }
];
