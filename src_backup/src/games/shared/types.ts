// Shared types for all games
export interface GamePosition {
  x: number;
  y: number;
}

export interface GameSize {
  width: number;
  height: number;
}

export interface GameBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface GameEntity {
  id: string;
  position: GamePosition;
  size?: number; // Change to number for simplicity
  color?: string;
  isActive?: boolean;
}

// Star system interfaces
export interface StarLevel {
  star: number;
  target: number;
  timeLimit?: number;
  speed?: number;
  difficulty?: number;
  description: string;
}

// Game state interfaces
export interface GameState {
  isStarted: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  currentStar: number;
  score: number;
  timeRemaining?: number;
  starsEarned: number;
}

// Animation interfaces
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface ParticleEffect {
  id: string;
  position: GamePosition;
  velocity: GamePosition;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}