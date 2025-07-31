import { GameEntity } from '../../shared/types';

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

export const BALLOON_STAR_LEVELS = [
  {
    star: 1,
    target: 5,
    description: 'แตะบอลลูน 5 ลูก'
  },
  {
    star: 2,
    target: 10,
    description: 'แตะบอลลูน 10 ลูก'
  },
  {
    star: 3,
    target: 20,
    description: 'แตะบอลลูน 20 ลูก'
  },
  {
    star: 4,
    target: 35,
    description: 'แตะบอลลูน 35 ลูก'
  },
  {
    star: 5,
    target: 50,
    description: 'แตะบอลลูน 50 ลูก'
  }
];