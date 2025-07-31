import { GameEntity } from '../../shared/types';

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

export const MOUSE_TRAIL_STAR_LEVELS = [
  {
    star: 1,
    target: 3,
    description: 'เก็บเพชร 3 เม็ด'
  },
  {
    star: 2,
    target: 6,
    description: 'เก็บเพชร 6 เม็ด'
  },
  {
    star: 3,
    target: 10,
    description: 'เก็บเพชร 10 เม็ด'
  },
  {
    star: 4,
    target: 15,
    description: 'เก็บเพชร 15 เม็ด'
  },
  {
    star: 5,
    target: 20,
    description: 'เก็บเพชร 20 เม็ด'
  }
];