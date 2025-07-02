export interface Balloon {
  id: string;
  position: { x: number; y: number };
  size: number;
  color: string;
  speed: number;
  popped: boolean;
  created: number;
}

export interface BalloonPopStarLevel {
  star: number;
  target: number;
  balloonSize: { min: number; max: number };
  balloonSpeed: { min: number; max: number };
  spawnRate: number; // milliseconds between spawns
  timeLimit: number;
  description: string;
}

export interface BalloonPopGameState {
  balloons: Balloon[];
  currentStar: number;
  balloonsPopped: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
  timeRemaining: number;
  mousePosition: { x: number; y: number };
  lastSpawn: number;
}