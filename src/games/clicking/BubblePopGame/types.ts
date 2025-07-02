import { GameEntity, StarLevel } from '../../shared/types';

export interface Bubble extends GameEntity {
  size: number;
  speed: number;
}

export interface BubbleStarLevel extends StarLevel {
  bubbleCount: number;
  bubbleSpeed: number;
  bubbleSize: { min: number; max: number };
  spawnRate: number;
}

export interface BubbleGameState {
  bubbles: Bubble[];
  currentStar: number;
  bubblesPopped: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
}