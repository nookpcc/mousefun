import { AreaCoverLevel } from './types';

export const AREA_COVER_STAR_LEVELS: AreaCoverLevel[] = [
  {
    level: 1,
    target: 3, // Number of areas to cover
    minTargetSize: 80,
    maxTargetSize: 120,
    coverageThreshold: 0.8, // 80% coverage
    description: 'Cover 3 areas (80% coverage)',
  },
  {
    level: 2,
    target: 4,
    minTargetSize: 70,
    maxTargetSize: 110,
    coverageThreshold: 0.85, // 85% coverage
    description: 'Cover 4 areas (85% coverage)',
  },
  {
    level: 3,
    target: 5,
    minTargetSize: 60,
    maxTargetSize: 100,
    coverageThreshold: 0.9, // 90% coverage
    description: 'Cover 5 areas (90% coverage)',
  },
  {
    level: 4,
    target: 6,
    minTargetSize: 50,
    maxTargetSize: 90,
    coverageThreshold: 0.92, // 92% coverage
    description: 'Cover 6 areas (92% coverage)',
  },
  {
    level: 5,
    target: 7,
    minTargetSize: 40,
    maxTargetSize: 80,
    coverageThreshold: 0.95, // 95% coverage
    description: 'Cover 7 areas (95% coverage)',
  },
];

export const GAME_AREA_WIDTH = 700;
export const GAME_AREA_HEIGHT = 400;
