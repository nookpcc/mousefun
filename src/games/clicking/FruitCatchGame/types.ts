import { GameEntity, StarLevel } from '../../shared/types';

export interface Fruit extends GameEntity {
  size: number;
  speed: number;
  type: string; // e.g., 'apple', 'banana'
}

export interface FruitCatchStarLevel extends StarLevel {
  fruitCount: number; // Max fruits on screen
  fruitSpeed: number; // Base falling speed
  fruitSize: { min: number; max: number };
  spawnRate: number; // How often fruits spawn (ms)
}

export interface FruitCatchGameState {
  fruits: Fruit[];
  catcherPosition: { x: number; y: number };
  currentStar: number;
  fruitsCaught: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
}
