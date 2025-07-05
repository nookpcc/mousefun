import { StarLevel, GamePosition } from '../../shared/types';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'star';

export interface Shape {
  id: string;
  type: ShapeType;
  color: string;
  position: GamePosition;
  size: number;
  isDragging: boolean;
  isPlaced: boolean;
}

export interface Target {
  id: string;
  type: ShapeType;
  position: GamePosition;
  size: number;
  isOccupied: boolean;
}

export interface ShapeSortStarLevel extends StarLevel {
  shapeCount: number;
  shapes: ShapeType[];
  timeLimit: number;
}

export interface ShapeSortGameState {
  shapes: Shape[];
  targets: Target[];
  currentStar: number;
  shapesPlaced: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
  timeRemaining: number;
}
