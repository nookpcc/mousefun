import { GameData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MouseTrailGame,
  HouseExplorerGame,
  BubblePopGame,
  ClickTargetGame,
  BalloonPopGame,
  ShapeSortGame,
  ActionClickerGame,
  PuzzlePiecesGame,
  MazeRunnerGame,
  FruitCatchGame,
  ScrollChallengeGame,
  AreaCoverGame,
} from '../games';

// Static game data with translation keys, re-ordered by skill progression
export const gameDataStatic = [
  // 1. House Explorer
  {
    id: 'house-explorer',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'pointing' as const,
    thumbnail: '🏠',
    backgroundColor: 'linear-gradient(135deg, #dbeafe 0%, #d1fae5 100%)',
    component: HouseExplorerGame
  },
  // 2. Gem Collector (Mouse Trail)
  {
    id: 'mouse-trail',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'movement' as const,
    thumbnail: '🌟',
    backgroundColor: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    component: MouseTrailGame
  },
  // 3. Balloon Pop
  {
    id: 'balloon-pop',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'clicking' as const,
    thumbnail: '🎈',
    backgroundColor: 'linear-gradient(135deg, #dbeafe 0%, #d1fae5 100%)',
    component: BalloonPopGame
  },
  // 4. Click Master
  {
    id: 'action-clicker',
    titleKey: 'actionClickerTitle',
    descriptionKey: 'actionClickerDescription',
    difficulty: 'medium' as const,
    category: 'clicking' as const,
    thumbnail: '🖱️',
    backgroundColor: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
    component: ActionClickerGame
  },
  // 5. Scroll Challenge
  {
    id: 'scroll-challenge',
    titleKey: 'scrollChallengeTitle',
    descriptionKey: 'scrollChallengeDescription',
    difficulty: 'medium' as const,
    category: 'scrolling' as const,
    thumbnail: '📜',
    backgroundColor: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
    component: ScrollChallengeGame
  },
  // 6. Shape Sort
  {
    id: 'shape-sort',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'easy' as const,
    category: 'dragging' as const,
    thumbnail: '🔷',
    backgroundColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    component: ShapeSortGame
  },
  // 7. Area Cover
  {
    id: 'area-cover',
    titleKey: 'areaCoverTitle',
    descriptionKey: 'areaCoverDescription',
    difficulty: 'medium' as const,
    category: 'dragging' as const,
    thumbnail: '🔲',
    backgroundColor: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
    component: AreaCoverGame
  },
  
  // 8. Maze Runner
  {
    id: 'maze-runner',
    titleKey: 'title',
    descriptionKey: 'description',
    difficulty: 'medium' as const,
    category: 'movement' as const,
    thumbnail: '🏃‍♂️',
    backgroundColor: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    component: MazeRunnerGame
  },
];

// Hook to get translated game data
export const useGameData = (): GameData[] => {
  const { t } = useLanguage();
  
  return gameDataStatic.map(game => ({
    ...game,
    // Dummy data for properties that might not be in the static list
    rating: 5,
    playCount: 10000,
    stars: 0,
    title: t(game.titleKey, game.id),
    description: t(game.descriptionKey, game.id)
  }));
};