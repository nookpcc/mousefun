// Standard star levels for useSimpleGameLogic
export const MAZE_RUNNER_STAR_LEVELS = [
  {
    star: 1,
    target: 1, // Complete 1 maze
    description: 'เขาวงกตง่ายๆ'
  },
  {
    star: 2,
    target: 1, // Complete 1 maze
    description: 'เขาวงกตปานกลาง'
  },
  {
    star: 3,
    target: 1, // Complete 1 maze
    description: 'เขาวงกตที่ซับซ้อนขึ้น'
  },
  {
    star: 4,
    target: 1, // Complete 1 maze
    description: 'เขาวงกตที่ท้าทาย'
  },
  {
    star: 5,
    target: 1, // Complete 1 maze
    description: 'เขาวงกตที่ยากที่สุด'
  }
];

// Maze-specific configurations
export const MAZE_CONFIGS = [
  {
    level: 1,
    maze: [
      [2, 0, 0],
      [1, 1, 0],
      [0, 0, 3]
    ],
    tileSize: 80,
    playerSpeed: 5
  },
  {
    level: 2,
    maze: [
      [2, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 3]
    ],
    tileSize: 60,
    playerSpeed: 4
  },
  {
    level: 3,
    maze: [
      [2, 0, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 1, 3]
    ],
    tileSize: 50,
    playerSpeed: 3
  },
  {
    level: 4,
    maze: [
      [2, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 0, 3]
    ],
    tileSize: 40,
    playerSpeed: 2.5
  },
  {
    level: 5,
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
    playerSpeed: 2
  }
];

export const PLAYER_SIZE = 20;
