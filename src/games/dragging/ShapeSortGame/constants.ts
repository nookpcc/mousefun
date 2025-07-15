import { ShapeSortStarLevel, ShapeType } from './types';

export const GAME_AREA = { width: 728, height: 400 };

export const SHAPE_COLORS: { [key in ShapeType]: string } = {
  circle: 'bg-blue-400',
  square: 'bg-green-400',
  triangle: 'bg-yellow-400',
  star: 'bg-pink-400',
};

export const TARGET_COLORS: { [key in ShapeType]: string } = {
  circle: 'border-blue-500 bg-blue-100',
  square: 'border-green-500 bg-green-100',
  triangle: 'border-yellow-500 bg-yellow-100',
  star: 'border-pink-500 bg-pink-100',
};

export const SHAPE_SORT_STAR_LEVELS: ShapeSortStarLevel[] = [
  {
    star: 1,
    target: 3,
    shapes: ['circle', 'square'],
    shapeCount: 3,
    timeLimit: 60,
    description: 'ลากวงกลมและสี่เหลี่ยมไปใส่ในกล่อง',
  },
  {
    star: 2,
    target: 5,
    shapes: ['circle', 'square'],
    shapeCount: 5,
    timeLimit: 50,
    description: 'เยี่ยมมาก! ลองอีกครั้งนะ',
  },
  {
    star: 3,
    target: 4,
    shapes: ['circle', 'square', 'triangle'],
    shapeCount: 4,
    timeLimit: 45,
    description: 'มีสามเหลี่ยมเพิ่มเข้ามาด้วย!',
  },
  {
    star: 4,
    target: 6,
    shapes: ['circle', 'square', 'triangle'],
    shapeCount: 6,
    timeLimit: 40,
    description: 'เก่งขึ้นเยอะเลย! จัดเรียงให้ครบนะ',
  },
  {
    star: 5,
    target: 5,
    shapes: ['circle', 'square', 'triangle', 'star'],
    shapeCount: 5,
    timeLimit: 35,
    description: 'ว้าว! มีดาวด้วย จัดการเลย!',
  },
];
