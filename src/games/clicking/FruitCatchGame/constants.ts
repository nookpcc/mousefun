import { FruitCatchStarLevel } from './types';

export const FRUIT_CATCH_STAR_LEVELS: FruitCatchStarLevel[] = [
  {
    star: 1,
    target: 5,
    fruitCount: 3,
    fruitSpeed: 1,
    fruitSize: { min: 60, max: 80 },
    spawnRate: 2000,
    description: 'จับผลไม้ 5 ลูก ขนาดใหญ่ ช้าๆ'
  },
  {
    star: 2,
    target: 8,
    fruitCount: 4,
    fruitSpeed: 1.2,
    fruitSize: { min: 50, max: 70 },
    spawnRate: 1800,
    description: 'จับผลไม้ 8 ลูก ขนาดปานกลาง เร็วขึ้นหน่อย'
  },
  {
    star: 3,
    target: 12,
    fruitCount: 5,
    fruitSpeed: 1.5,
    fruitSize: { min: 40, max: 60 },
    spawnRate: 1500,
    description: 'จับผลไม้ 12 ลูก ขนาดเล็กลง เร็วขึ้น'
  },
  {
    star: 4,
    target: 15,
    fruitCount: 6,
    fruitSpeed: 1.8,
    fruitSize: { min: 35, max: 55 },
    spawnRate: 1200,
    description: 'จับผลไม้ 15 ลูก ขนาดเล็ก เร็วมาก'
  },
  {
    star: 5,
    target: 20,
    fruitCount: 7,
    fruitSpeed: 2,
    fruitSize: { min: 30, max: 50 },
    spawnRate: 1000,
    description: 'จับผลไม้ 20 ลูก ขนาดจิ๋ว เร็วสุดๆ!'
  }
];

export const FRUIT_EMOJIS = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍍', '🥝'];
export const CATCHER_WIDTH = 100;
export const CATCHER_HEIGHT = 20;
export const FRUIT_FALL_INTERVAL = 50; // ms
export const FRUIT_CLEANUP_TIME = 5000; // ms, fruits disappear if not caught
