import { GameEntity, StarLevel } from '../../shared/types';

export type MazeTileType = 'wall' | 'path' | 'start' | 'end';

export interface MazeTile {
  x: number;
  y: number;
  type: MazeTileType;
}

export interface Maze {
  tiles: MazeTile[][];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export interface Player {
  x: number;
  y: number;
  size: number;
}

export interface MazeRunnerStarLevel extends StarLevel {
  maze: number[][]; // 0 for path, 1 for wall, 2 for start, 3 for end
  tileSize: number;
  playerSpeed: number;
}

export interface MazeRunnerGameState {
  maze: Maze;
  player: Player;
  currentStar: number;
  gameStarted: boolean;
  starCompleted: boolean;
  gameCompleted: boolean;
  earnedStars: number;
  mousePosition: { x: number; y: number };
}
