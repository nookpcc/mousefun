import { StarLevel, GamePosition } from '../../shared/types';

export interface Fruit {
  id: string;
  position: GamePosition;
  size: number;
  speed: number;
  type: number;
  isCaught: boolean;
}

export interface FruitCatchStarLevel extends StarLevel {
  fruitCount: number;
  fruitSpeed: number;
  fruitSize: { min: number; max: number };
  spawnRate: number;
}

export interface FruitCatchGameState {
  fruits: Fruit[];
  catcherPosition: GamePosition;
  currentStar: number;
  fruitsCaught: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
}
