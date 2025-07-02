import { BubbleStarLevel } from './types';

export const BUBBLE_STAR_LEVELS: BubbleStarLevel[] = [
  {
    star: 1,
    target: 3,
    bubbleCount: 3,
    bubbleSpeed: 0.5,
    bubbleSize: { min: 50, max: 70 },
    spawnRate: 2000,
    description: 'ฟองใหญ่ ช้าๆ ง่ายมาก'
  },
  {
    star: 2,
    target: 5,
    bubbleCount: 5,
    bubbleSpeed: 1,
    bubbleSize: { min: 40, max: 60 },
    spawnRate: 1800,
    description: 'ฟองปานกลาง เร็วขึ้นหน่อย'
  },
  {
    star: 3,
    target: 7,
    bubbleCount: 7,
    bubbleSpeed: 1.5,
    bubbleSize: { min: 35, max: 55 },
    spawnRate: 1500,
    description: 'ฟองเล็กลง เร็วขึ้น'
  },
  {
    star: 4,
    target: 10,
    bubbleCount: 10,
    bubbleSpeed: 2,
    bubbleSize: { min: 30, max: 50 },
    spawnRate: 1200,
    description: 'ฟองเล็ก เร็วมาก'
  },
  {
    star: 5,
    target: 12,
    bubbleCount: 12,
    bubbleSpeed: 2.5,
    bubbleSize: { min: 25, max: 45 },
    spawnRate: 1000,
    description: 'ฟองจิ๋ว เร็วสุดๆ!'
  }
];

export const BUBBLE_COLORS = [
  'bg-red-300', 
  'bg-blue-300', 
  'bg-green-300', 
  'bg-yellow-300', 
  'bg-purple-300', 
  'bg-pink-300'
];

export const BUBBLE_CLEANUP_TIME = 8000; // 8 seconds