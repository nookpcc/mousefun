export interface TargetArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isCovered: boolean;
}

export interface AreaCoverGameState {
  targetAreas: TargetArea[];
  currentStar: number;
  areasCovered: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
  dragCurrent: { x: number; y: number } | null;
}

export interface AreaCoverLevel {
  level: number;
  target: number; // Number of areas to cover
  minTargetSize: number;
  maxTargetSize: number;
  coverageThreshold: number; // Percentage of coverage required (0-1)
  description: string;
}