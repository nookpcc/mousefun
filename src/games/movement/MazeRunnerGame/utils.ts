import { Maze, MazeTile, MazeRunnerStarLevel, Player } from './types';
import { PLAYER_SIZE } from './constants';

export const createMaze = (level: MazeRunnerStarLevel): Maze => {
  const tiles: MazeTile[][] = [];
  let startPos = { x: 0, y: 0 };
  let endPos = { x: 0, y: 0 };

  for (let r = 0; r < level.maze.length; r++) {
    tiles[r] = [];
    for (let c = 0; c < level.maze[r].length; c++) {
      const type = level.maze[r][c] === 0 ? 'path' : level.maze[r][c] === 1 ? 'wall' : level.maze[r][c] === 2 ? 'start' : 'end';
      tiles[r][c] = { x: c, y: r, type };
      if (type === 'start') startPos = { x: c, y: r };
      if (type === 'end') endPos = { x: c, y: r };
    }
  }

  return { tiles, start: startPos, end: endPos };
};

export const initializePlayer = (maze: Maze, tileSize: number): Player => {
  return {
    x: maze.start.x * tileSize + tileSize / 2 - PLAYER_SIZE / 2,
    y: maze.start.y * tileSize + tileSize / 2 - PLAYER_SIZE / 2,
    size: PLAYER_SIZE
  };
};

export const isCollidingWithWall = (
  playerX: number,
  playerY: number,
  maze: Maze,
  tileSize: number
): boolean => {
  const playerLeft = playerX;
  const playerRight = playerX + PLAYER_SIZE;
  const playerTop = playerY;
  const playerBottom = playerY + PLAYER_SIZE;

  for (let r = 0; r < maze.tiles.length; r++) {
    for (let c = 0; c < maze.tiles[r].length; c++) {
      const tile = maze.tiles[r][c];
      if (tile.type === 'wall') {
        const wallLeft = c * tileSize;
        const wallRight = (c + 1) * tileSize;
        const wallTop = r * tileSize;
        const wallBottom = (r + 1) * tileSize;

        if (
          playerRight > wallLeft &&
          playerLeft < wallRight &&
          playerBottom > wallTop &&
          playerTop < wallBottom
        ) {
          return true; // Collision detected
        }
      }
    }
  }
  return false;
};

export const hasReachedEnd = (
  playerX: number,
  playerY: number,
  maze: Maze,
  tileSize: number
): boolean => {
  const playerCenterX = playerX + PLAYER_SIZE / 2;
  const playerCenterY = playerY + PLAYER_SIZE / 2;

  const endTileLeft = maze.end.x * tileSize;
  const endTileRight = (maze.end.x + 1) * tileSize;
  const endTileTop = maze.end.y * tileSize;
  const endTileBottom = (maze.end.y + 1) * tileSize;

  return (
    playerCenterX > endTileLeft &&
    playerCenterX < endTileRight &&
    playerCenterY > endTileTop &&
    playerCenterY < endTileBottom
  );
};
