// Export all games from their respective folders

// Movement games  
export { default as MouseTrailGame } from './movement/MouseTrailGame';
export { default as MazeRunnerGame } from './movement/MazeRunnerGame';

// Pointing games
export { default as HouseExplorerGame } from './pointing/HouseExplorerGame';

// Clicking games
export { default as BubblePopGame } from './clicking/BubblePopGame';

export { default as FruitCatchGame } from './clicking/FruitCatchGame';
export { default as BalloonPopGame } from './clicking/BalloonPopGame';

// Scrolling games
export { default as ScrollChallengeGame } from './scrolling/ScrollChallengeGame';

// Dragging games
export { default as ActionClickerGame } from './clicking/ActionClickerGame';
export { default as ShapeSortGame } from './dragging/ShapeSortGame';
export { default as AreaCoverGame } from './dragging/AreaCoverGame';


// Shared utilities
export * from './shared/types';
export * from './shared/constants';
export * from './shared/gameUtils';
export * from './shared/effects';