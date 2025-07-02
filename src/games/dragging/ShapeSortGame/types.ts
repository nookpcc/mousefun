export type ShapeType = 'circle' | 'square' | 'triangle' | 'star';

export interface Shape {
  id: string;
  type: ShapeType;
  color: string;
  initialPosition: { x: number; y: number };
  isSorted: boolean;
}

export interface Target {
  id: string;
  type: ShapeType;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface ShapeSortGameState {
  shapes: Shape[];
  targets: Target[];
  currentStar: number;
  shapesSorted: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
}

export interface ShapeSortStarLevel {
  star: number;
  shapes: ShapeType[];
  targetCount: number;
  description: string;
}
