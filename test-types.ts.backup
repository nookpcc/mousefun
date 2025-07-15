// Test file to verify all types work correctly
import { GameData, GameProps } from '../types';
import { BubblePopGame } from '../games/clicking/BubblePopGame';
import { MouseTrailGame } from '../games/movement/MouseTrailGame';

// Type test - this should compile without errors
const testGameData: GameData = {
  id: 'test-game',
  title: 'Test Game',
  description: 'Test Description',
  difficulty: 'easy',
  category: 'clicking',
  thumbnail: '🎮',
  backgroundColor: '#ffffff',
  component: BubblePopGame,
  rating: 5,
  playCount: 100,
  stars: 3
};

const testProps: GameProps = {
  onStarEarned: (stars: number) => console.log('Stars:', stars),
  onGameComplete: (completed: boolean) => console.log('Complete:', completed),
  onGameEnd: (score: number) => console.log('Score:', score),
  currentStars: 0,
  gameKey: 1
};

export { testGameData, testProps };
