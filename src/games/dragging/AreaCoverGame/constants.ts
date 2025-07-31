// Standard star levels for useSimpleGameLogic
export const AREA_COVER_STAR_LEVELS = [
  {
    star: 1,
    target: 3, // Cover 3 areas
    description: 'ครอบคลุม 3 พื้นที่ (80% ความแม่นยำ)'
  },
  {
    star: 2,
    target: 4, // Cover 4 areas
    description: 'ครอบคลุม 4 พื้นที่ (85% ความแม่นยำ)'
  },
  {
    star: 3,
    target: 5, // Cover 5 areas
    description: 'ครอบคลุม 5 พื้นที่ (90% ความแม่นยำ)'
  },
  {
    star: 4,
    target: 6, // Cover 6 areas
    description: 'ครอบคลุม 6 พื้นที่ (92% ความแม่นยำ)'
  },
  {
    star: 5,
    target: 7, // Cover 7 areas
    description: 'ครอบคลุม 7 พื้นที่ (95% ความแม่นยำ)'
  }
];

// Area-specific configurations
export const AREA_COVER_CONFIGS = [
  {
    level: 1,
    minTargetSize: 80,
    maxTargetSize: 120,
    coverageThreshold: 0.8 // 80% coverage
  },
  {
    level: 2,
    minTargetSize: 70,
    maxTargetSize: 110,
    coverageThreshold: 0.85 // 85% coverage
  },
  {
    level: 3,
    minTargetSize: 60,
    maxTargetSize: 100,
    coverageThreshold: 0.9 // 90% coverage
  },
  {
    level: 4,
    minTargetSize: 50,
    maxTargetSize: 90,
    coverageThreshold: 0.92 // 92% coverage
  },
  {
    level: 5,
    minTargetSize: 40,
    maxTargetSize: 80,
    coverageThreshold: 0.95 // 95% coverage
  }
];

export const GAME_AREA_WIDTH = 700;
export const GAME_AREA_HEIGHT = 400;
export const HEADER_HEIGHT = 80;
