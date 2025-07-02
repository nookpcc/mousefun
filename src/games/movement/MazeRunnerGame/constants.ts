import { MazeRunnerStarLevel } from './types';

export const MAZE_RUNNER_STAR_LEVELS: MazeRunnerStarLevel[] = [
  {
    star: 1,
    target: 1, // Reach the end
    maze: [
      [2, 0, 0],
      [1, 1, 0],
      [0, 0, 3]
    ],
    tileSize: 80,
    playerSpeed: 5,
    description: 'เขาวงกตง่ายๆ'
  },
  {
    star: 2,
    target: 1,
    maze: [
      [2, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 3]
    ],
    tileSize: 60,
    playerSpeed: 4,
    description: 'เขาวงกตปานกลาง'
  },
  {
    star: 3,
    target: 1,
    maze: [
      [2, 0, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 1, 3]
    ],
    tileSize: 50,
    playerSpeed: 3,
    description: 'เขาวงกตที่ซับซ้อนขึ้น'
  },
  {
    star: 4,
    target: 1,
    maze: [
      [2, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 0, 3]
    ],
    tileSize: 40,
    playerSpeed: 2.5,
    description: 'เขาวงกตที่ท้าทาย'
  },
  {
    star: 5,
    target: 1,
    maze: [
      [2, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 3]
    ],
    tileSize: 30,
    playerSpeed: 2,
    description: 'เขาวงกตที่ยากที่สุด'
  }
];

export const PLAYER_SIZE = 20;
