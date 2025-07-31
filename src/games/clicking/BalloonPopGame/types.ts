import { GameEntity, StarLevel } from '../../shared/types';

export interface Balloon extends GameEntity {
  type: 'balloon';
  speed: number;
  direction: number;
  popped: boolean;
  popTime?: number;
}

export interface BalloonGameState {
  balloons: Balloon[];
  nextBalloonId: number;
  difficultyMultiplier: number;
}

export const BALLOON_STAR_LEVELS: StarLevel[] = [
  {
    star: 1,
    target: 10,
    timeLimit: 30,
    description: 'แตะบอลลูน 10 ลูก ใน 30 วินาที'
  },
  {
    star: 2,
    target: 25,
    timeLimit: 45,
    description: 'แตะบอลลูน 25 ลูก ใน 45 วินาที'
  },
  {
    star: 3,
    target: 50,
    timeLimit: 60,
    description: 'แตะบอลลูน 50 ลูก ใน 60 วินาที'
  },
  {
    star: 4,
    target: 80,
    timeLimit: 75,
    description: 'แตะบอลลูน 80 ลูก ใน 75 วินาที'
  },
  {
    star: 5,
    target: 120,
    timeLimit: 90,
    description: 'แตะบอลลูน 120 ลูก ใน 90 วินาที'
  }
];