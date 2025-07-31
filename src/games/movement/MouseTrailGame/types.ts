import { GameEntity, StarLevel } from '../../shared/types';

export interface Gem extends GameEntity {
  type: 'gem';
  collected: boolean;
  glowIntensity: number;
  sparkleOffset: number;
}

export interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

export interface MouseTrailGameState {
  gems: Gem[];
  nextGemId: number;
  mouseTrail: TrailPoint[];
}

export const MOUSE_TRAIL_STAR_LEVELS: StarLevel[] = [
  {
    star: 1,
    target: 5,
    timeLimit: 45,
    description: 'เก็บเพชร 5 เม็ด ใน 45 วินาที'
  },
  {
    star: 2,
    target: 10,
    timeLimit: 60,
    description: 'เก็บเพชร 10 เม็ด ใน 60 วินาที'
  },
  {
    star: 3,
    target: 15,
    timeLimit: 75,
    description: 'เก็บเพชร 15 เม็ด ใน 75 วินาที'
  },
  {
    star: 4,
    target: 25,
    timeLimit: 90,
    description: 'เก็บเพชร 25 เม็ด ใน 90 วินาที'
  },
  {
    star: 5,
    target: 35,
    timeLimit: 120,
    description: 'เก็บเพชร 35 เม็ด ใน 120 วินาที'
  }
];