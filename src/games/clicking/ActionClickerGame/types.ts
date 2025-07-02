export type ClickType = 'left' | 'right';

export interface Target {
  id: string;
  position: { x: number; y: number; };
  size: number;
  clickType: ClickType;
  isHit: boolean;
  isActive: boolean;
  points: number;
}

export interface ActionClickerGameState {
  targets: Target[];
  currentStar: number;
  targetsHit: number;
  score: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
  missedClicks: number;
}

export interface ActionClickerLevel {
  level: number;
  target: number;
  targetCount: number;
  spawnRate: number;
  minSize: number;
  maxSize: number;
  minPoints: number;
  maxPoints: number;
  description: string;
}