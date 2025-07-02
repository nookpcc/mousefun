import { StarLevel } from '../../shared/types';

export interface Star extends GameEntity {
  collected: boolean;
  glowIntensity: number;
}

export interface MouseTrailStarLevel extends StarLevel {
  starCount: number;
  starSize: { min: number; max: number };
  timeLimit: number;
  spawnDelay: number;
}

export interface MouseTrailGameState {
  stars: Star[];
  currentStar: number;
  starsCollected: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
  timeRemaining: number;
  mousePosition: { x: number; y: number };
  trail: { x: number; y: number; opacity: number }[];
}